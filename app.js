const express = require('express');
const app = express();
const mongoose = require('mongoose');
const CONFIG = require('./config.json');

// Import Sales Route
const salesRoute = require('./routes/sales');
app.use('/sales', salesRoute)

// Database
mongoose.connect(`mongodb+srv://${CONFIG.dbUsername}:${CONFIG.dbPassword}@${CONFIG.dbCollectionName}.upvpg.mongodb.net/${CONFIG.dbName}?retryWrites=true&w=majority`, () => {
    console.log("Connected to database.");
});

// Server
app.listen(3000);