const express = require('express')
const router = express.Router();
const multer = require('multer');
const csv = require('fast-csv');
const Sales = require('../models/sales.model');
const { restart } = require('nodemon');

// Multer Setup
var upload = multer({ storage: multer.memoryStorage() });

router.get('/', (req, res) => {
    res.send("This is the sales page.");
});

router.post('/record', upload.single('file'), (req, res) => {
    if (req.file == undefined) {
        res.status(500).send({
            message: "The file sent is not a valid csv file."
        })
    }

    let csvData = []

    // Use streamifier use createReadStream function.
    const streamifier = require('streamifier');

    streamifier.createReadStream(req.file.buffer)
        .pipe(csv.parse({ headers: true }))
        .on('error', error => {throw error.message})
        .on('data', (row) => {
            csvData.push(row)
        })
        .on('end', () => {
            Sales.insertMany(csvData)
                .then( ()  => {
                    res.status(200).send({
                        message: "Database import success."
                    });
                })
                .catch( err => {
                    res.status(500).send({
                        message: "Database import failed.",
                        error: err.message
                    });
                })
        });    
});

// To get the range of reports, it must follow this pattern: dateRange YYYYMMDD-YYYYMMDD 20220505-20220525

router.get('/report/:dateRange', async (req, res) => {

    if (req.params.dateRange.length > 18 || req.params.dateRange.indexOf() == -1) {
        res.status(500).send({
            message: "The date range is in the wrong format."
        })
    }

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

module.exports = router
