var express = require('express');
var router = express.Router();

var passport = require('passport');

var User = require('../models/user');
var Verify = require('./verify');

router.post('/register', function (req, res, next) {

    var newUser = new User({
        name: req.body.name,
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        profileImage: req.body.profileImage
    });

    User.createUser(newUser, function (err, user) {
        if(err){
            err = new Error('Could Not Register New User!');
            err.status = 401;
            res.status(500).json({status: err, success: false});
        }

        res.status(200).json({
            status: "Registration Successful",
            success: true
        });
    });

});

router.post('/login', function(req, res, next){
    passport.authenticate('local', function(err, user, info) {
        if (err) return next(err);
        if (!user) return res.status(200).json( { status: info.message, success: false });
            // Login User
        req.logIn(user, function(err) {
            if (err) { return res.json({ status: 'Could not Login User!', success: false }); }
            var token = Verify.getToken(user);

            res.status(200).json({
                status: "Login Successful",
                success: true,
                token: token
            });
        });

    })(req, res, next);
});

//============================================================================

router.get('/profile', Verify.verifyUser, function(req, res, next){
    var user = req.user.toObject();

    delete user['__v'];
    delete user['password'];
    
    res.status(200).json({success: true, user: user});
});

//============================================================================


router.put('/profile/update', Verify.verifyUser, function(req, res, next){
    var user = req.body;
    var updatedUser = {};

    if(user.name) updatedUser.name = user.name;

    if(user.summary) updatedUser.summary = user.summary;

    if(user.hobbies) updatedUser.hobbies = user.hobbies;

    var filter = { _id: user._id };

    User.update(filter, updatedUser, {}, function(err, result){
        if (err) res.status(500).json({error: err});
        
        res.status(200).json({
            success: true,
            message: "Successfully Updated User."
        });
    });
});

router.get('/logout', Verify.verifyUser, function(req, res){
    req.logout();
    res.status(200).json({status: 'Logged Out', success: true});
});

module.exports = router;
