var mongoose = require('mongoose');
// mongoose.Schema.ObjectId
var postSchema = {
    userId: mongoose.Schema.ObjectId,
    author: { type: String },
    title: {type: String},
    bodyDescription: {type: String},
    profileImage: {type: String},
    date: {type: String},
    likes: [ { userId: String } ],
    tags: [ String ],
    comments: [ {
        userId: mongoose.Schema.ObjectId,
        author: String,
        body: String,
        profileImage: String,
        date: String
        // likes: [ { userId: String } ]
    } ]
};

module.exports.postModel = mongoose.model('post', postSchema, 'posts');
