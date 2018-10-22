var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

// User Schema
var userSchema = mongoose.Schema({
    username: {
        type: String,
        index: true
    },
    password: {
        type: String,
        bcrypt: true
    },
    email: {
        type: String
    },
    name: {
        type: String
    },
    summary: {
        type: String
    },
    hobbies: {
        type: String
    },
    profileImage: {
        type: String
    },
    facebook:{
        id: String,
        token: String,
        email: String,
        name: String,
        profileImage: String,
        hobbies: {
            type: String
        },
        summary: {
            type: String
        }
    },
    google:{
        id: String,
        token: String,
        email: String,
        name: String,
        profileImage: String,
        hobbies: {
            type: String
        },
        summary: {
            type: String
        }
    }
});

var User = mongoose.model('User', userSchema);
module.exports = User;

module.exports.createUser = function(newUser, callback){

    bcrypt.hash(newUser.password, 10, function(err, hash){
        if(err){
            
        }
        // Set Hash Password
        newUser.password = hash;
        newUser.save(callback);
    });
};

module.exports.getUserByUsername = function(username, callback){
    User.findOne({username: username}, callback);
};

module.exports.comparePasword = function(password, hash, callback){
    bcrypt.compare(password, hash, function(err, isMatch){
        if(err) return callback(err);
        callback(null, isMatch);
    });
};

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
};
