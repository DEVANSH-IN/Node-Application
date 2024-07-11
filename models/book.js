const mongoose = require('mongoose');
const { create } = require('./user');
const Schema = mongoose.Schema;

const bookSchema = new Schema({
    title:{
        type: String,
        required: true,
        minlength: 1
    },
    author:{
        type: String,
        required: true,
        minlength: 3
    },
    user:{ 
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
   

},
{
    timestamps: true
});

module.exports = mongoose.model('Book', bookSchema);
