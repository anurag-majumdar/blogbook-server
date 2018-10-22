var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../config/config');

exports.getToken = function (user) {
    return jwt.sign(user._id, config.secret, {
        expiresIn: 3600
    });
};

exports.verifyUser = function (req, res, next) {
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if(token){
        jwt.verify(token, config.secret, function (err, decoded) {
            if(err){
                err = new Error('You Are Not Authenticated!');
                err.status = 401;
                return next(err);
            }
            else{
                req.decoded = decoded;
                next();
            }
        });
    }
    else{
        var err = new Error('No Token Provided!');
        err.status = 403;
        return next(err);
    }
};
