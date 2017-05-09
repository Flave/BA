// app/models/user.js
// load the things we need
var mongoose = require('mongoose');
var shortid = require('shortid');

// define the schema for our user model
var userSchema = mongoose.Schema({
    _id: {
        type: String,
        'default': shortid.generate
    },
    predictions: [{trait: String, value: Number}],
    facebook : {
        id : String,
        token : String,
        email : String,
        name : String,
        likes: Array
    },
    twitter : {
        id : String,
        token : String,
        displayName : String,
        username : String
    },
    google : {
        id : String,
        token : String,
        email : String,
        name : String
    }
});

/*// checking if password is valid using bcrypt
userSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
};


// this method hashes the password and sets the users password
userSchema.methods.hashPassword = function(password) {
    var user = this;

    // hash the password
    bcrypt.hash(password, null, null, function(err, hash) {
        if (err)
            return next(err);

        user.local.password = hash;
    });

};*/

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);