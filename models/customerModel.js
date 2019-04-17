const mongoose = require("mongoose");

const Schema = mongoose.Schema;

var customerSchema = new Schema({
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    dob: {type: Date, required: true},
    contact: {
        address: {type: String},
        phone: {type: String},
        email: {type: String},
    },
    password: {type: String, required: true},
    favBooks: {type:[mongoose.Types.ObjectId], ref: "Book"}
});

var customerModel = new mongoose.model("Customer", customerSchema);

module.exports = {
    customerModel
}