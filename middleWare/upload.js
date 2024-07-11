const multer = require('multer');
const sharp = require('sharp');

const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {
    if(file.mimetype === 'image/jpef' || file.mimetype === 'image/png'){
        cb(null, true);
    } else{
        cb(new error('Invalid file type only JPG and PNG are allowed'), false);
    }

};

const upload = multer({
    storage,
    limits: {fileSize: 30 * 1024},
    fileFilter  
});


const resizeImage = async ( req , res, next) => {
    if(!req.file) {
        return next();
    }
    try{
        req.file.buffer =  await sharp(req.file.buffer)
        .resize(200,200)
        .toBuffer();
        next();
    } catch(err){
        next(err);
    }
};



module.exports = { resizeImage, upload};



