// Required depedencies 

const express    =   require('express');
const mongoose   =   require('mongoose');
const bodyParser =   require('body-parser');
const userRoutes =   require('./routes/users');
const bookRoutes =   require('./routes/books');
const connectDB  =   require('./db');
const adminRoutes =  require('./routes/admin');

const app = express();
const PORT = 3000;

// Database connection 

connectDB();
 

app.use(bodyParser.json());
  

//It handel the Routes 

app.use('/users', userRoutes);
app.use('/books', bookRoutes);
app.use('/admin', adminRoutes); 

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
  });

app.listen(PORT, ()=>{
    console.log(`server is running on the port ${PORT}`);
});








