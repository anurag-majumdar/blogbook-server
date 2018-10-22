var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');

var config = require('../config/config');
var User = require('../models/user');

var authenticate = expressJwt({
    secret: config.secret,
    requestProperty: 'auth',
    getToken: function(req) {
        if (req.headers['x-auth-token']) {
            return req.headers['x-auth-token'];
        }
        return null;
    }
});

var getCurrentUser = function(req, res, next) {
    User.findById(req.auth.id, function(err, user) {
        if (err) {
            next(err);
        } else {
            req.user = user;
            next();
        }
    });
};

var getOne = function (req, res) {
    var user = req.user.toObject();

    delete user['__v'];

    res.json(user);
};

router.route('/profile').get(authenticate, getCurrentUser, getOne);

var updateCurrentUser = function(req, res, next){
    var user = req.body;
    var updatedUser = {};

    if(user.google){
        updatedUser = {
            google: {}
        };
        if(user.name) updatedUser.google.name = user.name;
        if(user.summary) updatedUser.google.summary = user.summary;
        if(user.hobbies) updatedUser.google.hobbies = user.hobbies;
        if(user.profileImage) updatedUser.google.profileImage = user.profileImage;
        if(user.token) updatedUser.google.token = user.token;
        if(user.id) updatedUser.google.id = user.id;
        if(user.email) updatedUser.google.email = user.email;
    }

    else if(user.facebook){
        updatedUser = {
            facebook: {}
        };
        if(user.name) updatedUser.facebook.name = user.name;
        if(user.summary) updatedUser.facebook.summary = user.summary;
        if(user.hobbies) updatedUser.facebook.hobbies = user.hobbies;
        if(user.profileImage) updatedUser.facebook.profileImage = user.profileImage;
        if(user.token) updatedUser.facebook.token = user.token;
        if(user.id) updatedUser.facebook.id = user.id;
        if(user.email) updatedUser.facebook.email = user.email;
    }

    var filter = { _id: req.params.id };

    User.update(filter, updatedUser, {}, function(err, result){
        if (err) res.status(500).json({error: err});

        res.status(200).json({
            success: true,
            message: "Successfully Updated User."
        });
    });
};

router.route('/profile/update/:id').put(authenticate, updateCurrentUser);

module.exports = router;