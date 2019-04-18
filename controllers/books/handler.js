const {mongoose} = require("../../config/");

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
            if(!savedBook){
                return res.status(500).send({errorMessage: "The request processed successfully but the item wasn't saved."})
            }
            return res.status(200).send({savedBook});
        });
    },

    deleteBook: async (req, res, next) => {
        let bookToDelete = req.body.book_id;
        await Book.deleteOne({"_id" : bookToDelete})
        .then(result => {
            if(!result.deletedCount){
                return res.status(404).send({errorMessage: "Book Not Found"});
            }
            return res.status(204).send();
        })
        .catch(deleteError => {
            return res.status(500).send({errorMessage: "Error deleting book", deleteError});
        });
    },

    updateBook: (req, res, next) => {
        let book_id = req.params.bookId
        let updatedData = req.body;
        if(!mongoose.Types.ObjectId.isValid(book_id)){
            return res.status(400).send({errorMessage: "Invalid Book ID sent in URL params"});
        }
        Book.updateOne({"_id": book_id}, updatedData)
        .then(result => {
            if(!result.n){
                return res.status(404).send({errorMessage: "Book cannot be found"});
            } else if (!result.nModified){
                return res.status(200).send({warning: "Your request was successful, but the book wasn't updated. You probably sent existing data"});
            }
            return res.status(200).send({message: "The book has been updated successfully"});
        })
        .catch(updateError => {
            return res.status(500).send({errorMessage: "An error occurred while updating the book", updateError});
        })
    }
}