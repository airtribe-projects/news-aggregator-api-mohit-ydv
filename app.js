require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const userRouter = require('./src/routes/user');
const newsRouter = require('./src/routes/news');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const connectDB = async () => {
    await mongoose.connect(process.env.DB_URL);
};

app.use('/users', userRouter);
app.use('/news', newsRouter);

connectDB().then(() => {
    console.log("Connected to MongoDB successfully");
    app.listen(process.env.PORT, () => {
        console.log('Server is running on http://localhost:3000');
    });
}).catch(err => {
    console.log("Error connecting to MongoDB:", err.message);
});

module.exports = app;