var passport = require('passport');
var express = require('express');
var router = express.Router();
var expressJwt = require('express-jwt');

var jwt = require('jsonwebtoken');
var config = require('../config/config');
var User = require('../models/user');

var generateToken = function (req, res, next) {
    req.token = createToken(req.auth);
    next();
};

var createToken = function(auth) {
  return jwt.sign({
    id: auth.id
  }, config.secret,
  {
    expiresIn: 60 * 120
  });
};

var sendToken = function (req, res) {
    res.setHeader('x-auth-token', req.token);
    res.status(200).send(req.auth);
};

router.route('/facebook').post(passport.authenticate('facebook-token', {session: false}), function(req, res, next) {
    if (!req.user) {
        return res.send(401, 'User Not Authenticated');
    }

    // prepare token for API
    req.auth = {
        id: req.user.id
    };

    next();
}, generateToken, sendToken);

module.exports = router;