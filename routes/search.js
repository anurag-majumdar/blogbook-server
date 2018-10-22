var express = require('express');
var router = express.Router();

var postModel = require('../models/post').postModel;
var User = require('../models/user');
var config = require('../config/config');

router.post('/posts', function(req, res, next){

    var query = req.query.query;
    var searchFilter = {$text: { $search: query } };
    postModel.find(searchFilter, function(err, result){
        if(err) res.status(500).json({error: err});

        res.status(200).json({
            success: true,
            result: result
        });
    });

});

router.post('/users', function(req, res, next){

    var query = req.query.query;
    var searchFilter = {$text: { $search: query } };
    User.find(searchFilter, function(err, result){
        if(err) res.status(500).json({error: err});

        res.status(200).json({
            success: true,
            result: result
        });
    });

});

router.get('/user/:id', function(req, res){
    User.find({ _id: req.params.id }, function(err, user){
        if (err) res.status(500).json({error: err});
        
        res.status(200).json({
            success: true,
            data: user
        });
    });
});

router.get('/posts/user/:id', function(req, res){
    postModel.find({ userId: req.params.id }, function(err, posts){
        if (err) res.status(500).json({error: err});
        
        res.status(200).json({
            success: true,
            data: posts
        });
    });
});

module.exports = router;