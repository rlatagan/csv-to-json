const mongoose = require('mongoose');

const SalesSchema = mongoose.Schema({
    USER_NAME: String,
    AGE: Number,
    HEIGHT: String,
    GENDER: String,
    SALES: String,
    LAST_PURCHASE_DATE: Date
});

module.exports = mongoose.model('Sales', SalesSchema);