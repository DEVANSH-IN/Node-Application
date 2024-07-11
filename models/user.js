 const mongoose = require('mongoose');

 const userSchema = new mongoose.Schema({
    name: {
        type: String,
        require: true
    },

    email: {
        type: String,
        require: true,
        unique: true
    },

    password: {
        type: String,
        require: true
    },
    image: {
        type: Buffer,
        contentType: String
    }

 });

 const User = mongoose.model('User', userSchema)

module.exports = User;