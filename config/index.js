const mongoose = require("mongoose");

/**
 * Use the default node.js promise library
 */
mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost:27017/elib", { useNewUrlParser: true }, err => {
    if(err){
        return console.log(`Error connecting to MongoDB: ${err}`);
    }
    console.log("Mongoose connected to the MongoDB on default port: 27017");
});

module.exports = {mongoose}