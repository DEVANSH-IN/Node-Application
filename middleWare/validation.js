const { check, validationResult } = require('express-validator');
const { search } = require('../routes/books');

// Rules for user validation 
const userValidationRules = {
    register: [
        check('name').not().isEmpty().withMessage('Name is Required for Registration.'),
        check('email').isEmail().withMessage('Sorry! Invalid Email format Please try again. '),
        check('password').isLength({min: 8}).withMessage('Password Should be 8 Characters long')
        .matches(/(?=.*[a-z])/).withMessage('password must contain at least one lower case.')
        .matches(/(?=.*[A-Z])/).withMessage('password must contain at least one upper case ')
        .matches(/(?=.*\d)/).withMessage('password must contain at least one digit.')
        .matches(/(?=.*[!@#$%^&*()_+[\]{}|;:',.<>?])/).withMessage('password must contain at least one special symbol :)')

    ],
    login: [
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').not().isEmpty().withMessage('Password is required')
    ],

};

// Rules for book validation 
const bookValidationRules = {
    add: [
        check('title').isEmpty().not().isLength({min: 3}).withMessage('Title is required'),
        check('author').isEmpty().not().isLength({min: 3}).withMessage('Author name is required and must be 3 charcater long.')

    ],

    search: [
        check('query').not().isEmpty().withMessage('Please provide a search query')
    ]
};


// Rules for admin validation
 const adminValidationRules = {
    register: [
        check('name').not().isEmpty().withMessage('Name is Required.'),
        check('email').isEmail().withMessage('Invalid email format.'),
        check('password').isLength({min: 8}).withMessage('Password must be 8 character long. :)')
        .matches(/(?=.*[a-z])/).withMessage('Password must be at least one lower case')
        .matches(/(?=.*[A-Z])/).withMessage('password must be at least one upper case.')
        .matches(/(?=.*\d)/).withMessage('password must be at least one digit.')
        .matches(/(?=.*[!@#$%^&*()_+[\]{}|;:',.<>?])/).withMessage('Password must be at least one special symbole. :)')
    ],

    login: [
        check('email').isEmail().withMessage('Invalid email format'),
        check('password').isEmpty().not().withMessage('password is required')
    ]
 };



 // export all module 
 module.exports = {
    userValidationRules,
    adminValidationRules,
    bookValidationRules,
    validationResult
 }