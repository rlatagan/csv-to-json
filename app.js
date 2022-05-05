const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const csv = require('fast-csv');
const Sales = require('./models/Sales')

// Multer Setup
var upload = multer({ storage: multer.memoryStorage() });

// Routes
app.get('/sales', (req, res) => {
    res.send("This is the sales page.");
});

app.post('/sales/record', upload.single('file'), (req, res) => {
    let csvData = []

    // Use streamifier use createReadStream function.
    const streamifier = require('streamifier');
    streamifier.createReadStream(req.file.buffer)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => console.error(error))
        .on('data', (row) => {
            csvData.push(row)
        })
        .on('end', () => {
            Sales.insertMany(csvData)
                .then( () => {
                    console.log("Data inserted.")
                })
                .catch( (error) => {
                    console.log(error)
                })
        });
});

// To get the range of reports, it must follow this pattern: dateRange YYYYMMDD-YYYYMMDD 20220505-20220525

app.get('/sales/report/:dateRange', async (req, res) => {

    // Format YYYYMMDD to YYYY-MM-DD
    const dateFormat = (date) => {
        let year = date.substring(0, 4);
        let month = date.substring(4, 6);
        let day = date.substring(6, 8);
        return new Date(`${year}-${month}-${day}`);
    }

    // Turns dateRange to startDate and endDate.
    const startDate = dateFormat(req.params.dateRange.split('-')[0]);
    const endDate = dateFormat(req.params.dateRange.split('-')[1]);

    // Finds the objects that are within date range.
    let salesDB = await Sales.find({
        LAST_PURCHASE_DATE: {$gte: startDate, $lte: endDate}
    }).sort('rating')

    // Formats object array to required format.
    const result = salesDB.map( elm => ({userName: elm.USER_NAME, age: elm.AGE, height: elm.HEIGHT, gender: elm.GENDER, sales: elm.SALES, lastPurchaseDate: elm.LAST_PURCHASE_DATE}))
    res.send(result)
});

// Database
mongoose.connect('mongodb+srv://rlatagan:GhYBmU0iwq99gSyR@cluster0.upvpg.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', () => {
    console.log("Connected to database.");
});

// Server
app.listen(3000);