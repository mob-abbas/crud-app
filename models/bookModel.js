const {mongoose} = require("../config/index");

const Schema = mongoose.Schema;

var bookSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    author: {
        _id: {
            type: mongoose.Types.ObjectId,
            default: new mongoose.Types.ObjectId()
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        contact: {
            address: {type: String},
            phone: {type: String},
            email: {type: String},
            website: {type: String}
        }
    },
    ISBN: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        default: 0
    },
    datePublished: {
        type: Date,
        required: true
    },
    ageGroup: {
        min: {type: Number},
        max: {type: Number}
    }
});

var Book = new mongoose.model("Book", bookSchema);

module.exports = {
    Book
}
