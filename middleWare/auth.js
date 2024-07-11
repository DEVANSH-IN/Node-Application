// 
const jwt = require('jsonwebtoken')
  // middleware works as helper in node.js 
 

module.exports = (req, res, next) => {
    const token = req.header('Authorization');
    if (!token){
        return res.status(401).json({message: 'Authoriztion Denied, no token'});
    }
   
try{
    const decode = jwt.verify(token, 'jwt_secret');
    req.user = decode.User;
    next();

} catch (err){
    res.status(401).json({Message: 'token is not valid'});

}

};

