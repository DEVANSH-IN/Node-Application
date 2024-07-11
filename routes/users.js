// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const auth = require('../middleWare/auth');
const bcrypt = require('bcrypt');
const { userValidationRules, validationResult } = require('../middleWare/validation');
const { upload, resizeImage  } = require('../middleWare/upload')

// --------- -------Register New User---------------------------------:)


 
// Regiter a  new user 
router.post('/register',upload.single('image'), resizeImage,  async (req, res) => {
     
    const errors = validationResult(req);
    if(!errors.isEmpty()){
         return res.status(400).json({errors: errors.array()});
    }

    const { name, email, password } = req.body;

    //check user is already register with us...

    const existingUser = await User.findOne({ email });
    if(existingUser){
        return res.status(400).json({message: 'You are already have an Account with us. :)'})
    }

  
    try{
        // adding bcrpt password that coverts 
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({name, email, password: hashedPassword });
        await user.save();
        return res.status(200).json({message: 'User register successfully'});

    }
    catch(err){
        return res.status(400).json({message: err.message}) //display source error message 
    }
});



// -----------------------------Login a user--------------------------------------


router.post('/login', async (req, res) => {

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

    const {email, password} = req.body;
 
    const user = await User.findOne({ email });
    if (!user) {s
        return res.status(400).json({ message: 'Invalid credentials, try one more time..' });
    }

    // Compare the plain text password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials, try one more time..' });
    }

    // jwt wala code 
    const payload = { User: { id: user.id } };
    const token = jwt.sign(payload, 'jwt_secret', { expiresIn: '24h' });

    res.json({ message: 'Login successful', token });
});



// update user profile if user exist in our database: 

router.put('/profile', auth, upload.single('image'), resizeImage, async(req, res) =>{
    

   const errors = validationResult(req);
   if(!errors.isEmpty()){
     return res.status(400).json({errors: errors.array()});
   };

   const {name, email, password } = req.body;


    try{
        const updates = {};
        if (name) updates.name = name;
        if (email) updates.email = email;
      // if (password) updates.password = password;
        if (password) updates.password = await bcrypt.hash(password, 10);
        if (req.file) {
            updates.image = {
                data: req.file.buffer,
                contentType: req.file.mimetype
            };
        }
    
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if(req.file && user.image && user.image.data){


// if we found an image so delete the existing image from our mongoDB 
        await User.findByIdAndUpdate(req.user.id, {$unset: {image: 1}});
        // update new image of user:
        await User.findByIdAndUpdate(res.user.id, { $set: {image: updates.image}});

    }
    res.json({message: 'Profile updated Successfully. :)', user})
    }    catch(err){
        res.status(500).json({Message: err });
    }
});


// here we can export this function 
 module.exports = router;


















