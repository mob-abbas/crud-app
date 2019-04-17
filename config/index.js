const mongoose = require("mongoose");

/**
 * Use the default node.js promise library
 */
mongoose.Promise = global.Promise;

const mongoURI = process.env.MONGODB_URI;

mongoose.connect(mongoURI || 'mongodb://localhost:27017/elib', {
    useMongoClient: true
});

module.exports = {mongoose}