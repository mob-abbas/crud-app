const {mongoose, redisClient} = require("../../config/");

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
        });
    },
    /**
    * First tries to find the book by ID sent in request, if not found, responds accordingly.
    * If the book is found, a check is performed if it is already reserved by someone else --> This check is needed to adjust the book's quantity correctly
    * Redis stores 2 keys, one for each user where book's key is stored against userId --> Should use HASH --> User can reserve more than one books --> Not sure how to implement HASH here.
    * The other Redis key stores total quantity reserved for a specific book_id and it's value is incremented for each new reservation
    * How do I know when a key expires so that I can update the book's quantity again (i.e. increase quantity when a reservation expires and book isn't checked-out) --> Not implemented --> Not sure how to :(
    */
    reserveBook: async (req, res, next) => {
        let book_id = req.params.bookId;
        if(!verifyObjectId(book_id)){
            return res.status(400).send({errorMessage: "Invalid Book ID sent in URL params"});
        }
        await Book.findById(book_id)
            .then(async bookToBeReserved => {
                if(!bookToBeReserved){
                    return res.status(404).send({errorMessage: "The book you're trying to reserve couldn't be found."});
                }
                //Check if the book is already reserved
                redisClient.get(book_id, async function(redisError, exists){
                    if(!exists){ 
                        //book isn't reserved in the last 2 mins, create a new reservation for current user for 2 mins
                        await redisClient.SETEX(req.body.userId, 120, book_id);
                        //create a key for current book to keep track of it's total reservation --> Looks like we have a busy library :P
                        await redisClient.SETEX(book_id, 120, 1);
                    } else {
                        //and also add a reservation against the current user --> I'm assuming this user is different,
                        //BUT this could be existig user trying to reserve for the second time --> HASH could be used --> SEE LINE 68
                        await redisClient.SETEX(req.body.userId, 120, book_id);
                        //book is already reserved by someone else, just increment the value by 1
                        //WARN: This else block runs if the "book_id" key exists in Redis, and then it increments its value
                        //BUT the value might have been deleted when the control reaches here and the following INCR function might throw an error
                        try{
                            await redisClient.incr(book_id);
                        }
                        catch(redisIncrementError) {
                            console.log("The key for book_id was not found. Should create a new one");
                        }
                        finally {
                            await redisClient.SETEX(book_id, 120, 1);
                        }
                    }
                    let quantity = bookToBeReserved.quantity - exists;
                    await Book.updateOne({_id: book_id}, {quantity})
                            .then(result => {
                                if(!result.n){
                                    return res.status(404).send({errorMessage: "Book cannot be found"});
                                } else if (!result.nModified){
                                    return res.status(200).send({warning: "The book was reserved, but the book's quantity wasn't updated."});
                                }
                                return res.status(200).send({message: "The book has been reserved successfully and it's quantity was also updated"});
                            })
                            .catch(reserveError => {
                                return res.status(500).send({errorMessage: "Error while reserving the book"})
                            });
                });
            });
    },

    findBookById: async (req, res, next) => {
        let isValidId = await verifyObjectId(req.params.bookId);
        if(!isValidId){
            console.log("not valid");
            return res.status(400).send({errorMessage: "Invalid Book ID sent in URL params"});
        }
        
        let book_id = req.params.bookId;
        Book.findById(book_id)
        .then(foundBook => {
            if(!foundBook) {
                return res.status(404).send({errorMessage: `The book for _id: ${book_id} was not found. Perhaps you sent a wrong key?`})
            }
            return res.status(200).send({book: foundBook});
        })
        .catch(findByIdError => {
            return res.status(500).send({errorMessage: "There was an error finding the book. More info can be found in the error Object below.", findByIdError});
        });
    },

    getAll: async (req, res, next) => {
        Book.find().then(books => {
            if (!books) {
                return res.status(404).send({message: "No books were found. The database is probably empty."});
            }
            return res.status(200).send({books});
        }).catch(findBooksError => {
            return res.status(500).send({errorMessage: "There was an error fetching books data from DB, more info can be found in the error key below.", findBooksError});
        });
    }
}

var verifyObjectId = async objectId => { return mongoose.Types.ObjectId.isValid(objectId)};