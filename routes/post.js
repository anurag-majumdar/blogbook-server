var express = require('express');
var router = express.Router();

var postModel = require('../models/post').postModel;

// Get All Posts
router.get('/post', function(req, res, next){
    postModel.find({}, function(err, posts){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            data: posts
        });
    });
});

// Get Posts by User ID
router.get('/my-post/:id', function(req, res, next){
    var filter = { userId: req.params.id };

    postModel.find(filter, function(err, posts){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            data: posts
        });
    });
});

// Get One Post
router.get('/post/:id', function(req, res, next){
    postModel.findOne({_id: req.params.id}, function(err, post){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            data: post
        });
    });
});

// Post a Post
router.post('/post', function(req, res, next){
    var post = new postModel();

    post.userId = req.body.userId;

    if(req.body.author) post.author = req.body.author;

    if(req.body.profileImage) post.profileImage = req.body.profileImage;

    if(req.body.date) post.date = req.body.date;

    if(req.body.title) post.title = req.body.title;

    if(req.body.bodyDescription) post.bodyDescription = req.body.bodyDescription;

    if(req.body.tags) post.tags = req.body.tags;

    if (!post) {
        res.status(400);
        res.json({'error': 'Invalid Data'});
    }

    post.save(function(err, post){
        if(err){
            res.status(500).json({error: err});
        }

        res.json({
            success: true,
            message: "Successfully created Post."
        });
    });
});

// Update a Post
router.put('/post/:id', function(req, res, next){
    var post = req.body;
    var updatePost = {};

    if(post.title) updatePost.title = post.title;

    if(post.bodyDescription) updatePost.bodyDescription = post.bodyDescription;

    if(post.tags) updatePost.tags = post.tags;

    if(!updatePost){
        res.status(400);
        res.json({'error': 'Invalid Data'});
    }

    var filter = { _id: req.params.id };

    postModel.update(filter, updatePost, {}, function(err, result){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            message: "Successfully Updated Post."
        });
    });
});

// Delete a Post
router.delete('/post/:id', function(req, res, next){
    var filter = { _id: req.params.id };
    postModel.findOneAndRemove(filter, function(err, result){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            message: "Successfully Deleted Post."
        });
    });
});

// Update Post Likes
router.put('/post/like/:id', function(req, res, next) {
    var post = req.body;
    var updatePost = {};

    if(post.likes) updatePost.likes = post.likes;

    var filter = { _id: req.params.id };

    postModel.update(filter, updatePost, {}, function(err, result){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            message: "Successfully Updated Post Likes."
        });
    });

});

// Get Comments
router.get('/comment/:postId', function(req, res, next){
    var filter = { _id: req.params.postId };

    postModel.find(filter, function(err, post){
        if(err){
            res.status(500).json({error: err});
        }

        res.json({
            success: true,
            data: post[0].comments
        });
    });
});

// Post a Comment
router.post('/comment/:postId', function(req, res, next){
    var comment = { userId: req.body.userId, author: req.body.author, body: req.body.body, date: req.body.date, profileImage: req.body.profileImage };
    var filter = { _id: req.params.postId };
    var addComment = { $push: { comments: comment } };

    postModel.findOneAndUpdate(filter, addComment, function(err, post){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            message: "Successfully Posted Comment."
        });
    });
});

// Edit a Comment
router.put('/comment/:postId', function(req, res, next){
    var filter = { _id: req.params.postId, "comments._id": req.query.commentId };
    var updateComment = { $set: { "comments.$.body": req.body.body } };

    postModel.update(filter, updateComment, {}, function(err, result){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            message: "Successfully Updated Comment."
        });
    });

});

// Delete a Comment
router.delete('/comment/:postId', function(req, res, next){
    var filter = { _id: req.params.postId };
    var deleteComment = { $pull: { comments: { _id: req.query.commentId } } };
    postModel.update(filter, deleteComment, function(err, response){
        if(err){
            res.status(500).json({error: err});
        }

        res.status(200).json({
            success: true,
            message: "Successfully Deleted Comment."
        });
    });
});

module.exports = router;