const express = require('express');
const router = express.Router(); 
const Admin = require('../models/admin');
const Book = require('../models/book');
const User = require('../models/user');
const auth = require('../middleWare/auth');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const {adminValidationRules, validationResult } = require('../middleWare/validation');
const { route } = require('./books');
const adminAuth = require('../middleWare/adminAuth');
const pagination = require('../middleWare/pagination');
const sharp = require('sharp');
const { upload, resizeImage} = require('../middleWare/upload');



// Admin login 

router.post('/login', async(req, res) =>{
    

   const errors = validationResult(req);
   if(!errors.isEmpty()){
    return res.status(400).json({errors: errors.array() });
   }
    
   const { email, password } = req.body;

  const admin = await Admin.findOne({ email })
   if(!admin){
     return res.status(400).json({message:'Invalid credentials, try one more time.'})
   }

   const parsedAdmin =JSON.parse(JSON.stringify(admin))
   const isMatch = await bcrypt.compare(password, parsedAdmin.password);
   console.log(password, parsedAdmin.password,isMatch);
    if(!isMatch){
       return res.status(400).json({message:('Invalid Password, Please try one more time :)')})
    }
   const payload = { Admin: {id: admin.id } };
   const token = jwt.sign(payload, 'jwt_secret', { expiresIn: '24h' });

  res.json({message: 'Admin login Successfully', token});


});

// view all user's books 
router.get('/allbooks', adminAuth, pagination(Book), async (req, res) => {
  try {
    res.status(200).json(res.paginatedResults);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// serach book by tittle author and user's name && email 

router.get('/search', adminAuth,  async(req, res) =>{
    const { query, page = 1, limit = 10 } = req.query;
    if(!query){
        res.status(400).json({message: err.message})
    };

    try {
        const book = await Book.find({
            $or: [
                {title: new RegExp(query, 'i')},
                {author: new RegExp(query, 'i')}
            ]
        });
        res.status(200).json({
            books,
            totalpages: Math.ceil(count/limit),
            currentPage: page
        });
    }catch (err) {
        res.status(400).json({message: err.message})
    }
});

//  create new admin by admin 

router.post('/register', upload.single('image'), resizeImage,  async(req, res) =>{
    

    const errors = validationResult(req);
    if(!errors.isEmpty){
       return res.status(400).json({errors: errors.array()} );
    }

    const {name, email, password} = req.body;

    const existingAdmin = await Admin.findOne({ email });
    if(existingAdmin){
        res.status(400).json({message:'You already have an account with us. :)'})
    }

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin ({name, email, password: hashedPassword});
        await admin.save();
        res.status(200).json({message: 'Admin Registered Successfully, Thank-You'});
    } catch(err){
        res.status(400).json({message: err.message})
    }
});

// // Delete an admin
//  router.delete('/:id', adminAuth, async(req,res)=>{
//     try{
//         await Admin.findByIdAndDelete(req.params.id);
//         res.status(200).json({message:'Admin Deleted Successfully.!'})
//     } catch(err){
//         res.status(400).json({message: err.message})
//     }
//  })


// Delete a user by ID
router.delete('/users/:id', adminAuth, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'No user found Sorry :(' });
        }

        await user.remove();
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

 module.exports = router;

