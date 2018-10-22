var FacebookTokenStrategy = require('passport-facebook-token');
var GoogleTokenStrategy = require('passport-google-token').Strategy;
var LocalStrategy = require('passport-local').Strategy;
var configAuth = require('./auth');

var User = require('../models/user');

module.exports = function(passport){

    passport.serializeUser(function(user, done){
		done(null, user.id);
	});

	passport.deserializeUser(function(id, done){
		User.findById(id, function(err, user){
			done(err, user);
		});
    });

    passport.use(new LocalStrategy(
        function (username, password, done) {
            User.getUserByUsername(username, function (err, user) {
                if(err){
                    return done(null, {message: "username error"});
                }

                if(!user){
                    return done(null, {message: 'incorrect username'});
                }

                User.comparePasword(password, user.password, function(err, isMatch){
                    if(err){
                        return done(null, {message: "password error"});
                    }
                    if(isMatch){
                        return done(null, user);
                    }
                    else{
                        return done(null, {message: 'incorrect password'});
                    }
                });

            });
        }
    ));

    passport.use(new FacebookTokenStrategy({
      clientID: configAuth.facebookAuth.clientID,
      clientSecret: configAuth.facebookAuth.clientSecret,
      profileFields: ['id', 'name', 'email', 'gender', 'profileUrl', 'photos']
    },
    function (accessToken, refreshToken, profile, done) {
        User.findOne({ 'facebook.id': profile.id }, function(err, user){
            if(err) return done(err);
            if(user) return done(null, user);
            else{
                var newUser = new User();
                newUser.facebook.id = profile.id;
                newUser.facebook.token = accessToken;
                newUser.facebook.name = profile.name.givenName + " " + profile.name.familyName;
                newUser.facebook.email = profile.emails[0].value;
                newUser.facebook.profileImage = profile.photos[0].value;

                newUser.save(function(err, res){
                    if(err) console.log(err);
                    return done(null, newUser);
                });
            }
        });
    }));

    passport.use(new GoogleTokenStrategy({
            clientID: configAuth.googleAuth.clientID,
            clientSecret: configAuth.googleAuth.clientSecret
        },
        function(accessToken, refreshToken, profile, done) {
            User.findOne({ 'google.id': profile.id }, function(err, user){
                if(err) return done(err);
                if(user) return done(null, user);
                else{
                    var newUser = new User();
                    newUser.google.id = profile.id;
                    newUser.google.token = accessToken;
                    newUser.google.name = profile.displayName;
                    newUser.google.email = profile.emails[0].value;
                    newUser.google.profileImage = profile._json['picture'];

                    newUser.save(function(err, res){
                        if(err) console.log(err);
                        return done(null, newUser);
                    });
                }
            });
        }
    ));

};