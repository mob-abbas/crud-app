
const {Book} = require("../../models/bookModel");


module.exports = {
    addBook: async (req, res, next) => {

        const {name, author, ISBN, quantity, datePublished, ageGroup} = req.body;
        var newBook = new Book({
            name,
            author,
            ISBN,
            quantity,
            datePublished : new Date(datePublished),
            ageGroup
        });

        newBook.save().then(savedBook => {
            console.log(savedBook);
            if(!savedBook){
                return res.status(500).send({errorMessage: "The request processed successfully but the item wasn't saved."})
            }
            return res.status(200).send({savedbook});
        }).catch(saveError => {
            if(saveError){
                return res.status(500).send({errorMessage: "An error occurred while saving the item", saveError})
            }
        });
    },

    deleteBook: (req, res, next) => {

    },

    updateBook: (req, res, next) => {

    }
}