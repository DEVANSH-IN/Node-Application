const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const auth = require('../middleWare/auth');
const User = require('../models/user');
const { bookValidationRules, validationResult } = require('../middleWare/validation');
const pagination = require('../middleWare/pagination')


// adding new book 

router.post('/add', auth, async (req, res) =>{
    

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array() });
    };

    const { title, author} = req.body;

    try{
        const book = new Book({title, author, user: req.user.id});
        await book.save();
        res.status(200).json({message: 'Book added Successfuly.! Thanks!', book});
    } catch(err){
        res.status(400).json({Message: err.message});
    }
});


// fetch book by admin user

router.get('/mybooks', auth, pagination(Book), async(req, res) => {
    try{
        const books = await Book.find({user: req.user.id});
        res.status(200).json({message:{ books }});
    } catch(err){
        res.status(400).json({message: 'No book found at your kingdome. Add books :)'});

    }
});




// search books 

router.get('/search', auth, pagination(Book), async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty){
        return res.status(400).json({ errors: errors.array() });
    }
    const { query } = req.query;

    try {
        // Find books that belong to the authenticated user and match the query
        const books = await Book.find({
            user: req.user.id,
            $or: [
                { title: new RegExp(query, 'i') },
                { author: new RegExp(query, 'i') }
            ]
        });

        res.status(200).json({ books });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});



// Get a specific book by ID if it was added by the logged-in user

router.get('/:id', auth, async(req, res) => {
    try {
        const book = await Book.findOne({ _id: req.params.id, user: req.user.id });
        if (!book) {
            return res.status(404).json({ message: 'Book not found! :( Sorry.'  });
        }
        res.status(200).json({ message: { book } });
    } catch (err) {
        res.status(400).json({ message: 'Your Book id is Incorrect, Please try again. :)' });
        console.log(err.message)
    }
});




// export routes 

module.exports = router;