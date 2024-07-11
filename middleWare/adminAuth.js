const jwt = require('jsonwebtoken');
const Admin = require('../models/admin'); 

const adminAuth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (!authHeader) {
            console.log('No token found');
            return res.status(401).json({ message: 'No token found, authorization denied, sorry' });
        }

        const token = authHeader.split(' ')[1]; // Assuming format is "Bearer <token>"
        if (!token) {
            console.log('Token format is incorrect');
            return res.status(401).json({ message: 'Token format is incorrect' });
        }

        const decoded = jwt.verify(token, 'jwt_secret');
        console.log('Decoded token:', decoded);
        req.admin = decoded.Admin;
        
        const admin = await Admin.findById(req.admin.id);
        console.log('Admin found:', admin);

        if (!admin || !admin.isAdmin) {
            console.log('Authorization denied');
            return res.status(401).json({ message: 'Authorization denied' });
        }

        next();
    } catch (err) {
        console.log('Error:', err);
        res.status(401).json({ message: 'Token is not valid' });
    }
};

module.exports = adminAuth;
