const mongoose = require('mongoose');
const Admin = require('./models/admin');
const bcrypt = require('bcrypt');
const connectDB = require('./db');

async function createFirstAdmin() {
    await connectDB();

    const adminExists = await Admin.findOne({ email: 'admin@gate6.com' });

    if (!adminExists) {
        const hashedPassword = await bcrypt.hash('adminpassword', 10);
        const admin = new Admin({
            name: 'Power Admin',
            email: 'admin@gate6.com',
            password: hashedPassword,
            isAdmin: true
        });

        await admin.save();
        console.log('First admin created successfully');
    } else {
        console.log('Admin with this email already exists');
    }

    mongoose.connection.close();
}

createFirstAdmin().catch(err => console.error(err));



