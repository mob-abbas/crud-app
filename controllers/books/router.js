/**
 * This file contains all the routes related to the books. This file only defines the routes and any middleware functions (if any)
 * The handlers for all the routes are in a separate file/module and are kept this way to make things simpler. This is how I prefer
 * structuring my project and if it's something not recommended, please let me know.
 */
const router = require("express")();

const routeHandler = require("./handler");

/**
 * API endpoint for adding a book to the database
 *Payload MUST contain the Book's name, Author details, ISBN, Publishing date, quantity and date of publishing.
 * Additional info like Age Group can also be entered to restrict undreage users from viewing certain books.*/
router.post("/add", routeHandler.addBook);

/**
 * API endpoint for deleting a book. The route accepts a Book ID which is automatically sent along with the request when a book is selected for deletion.
 */
router.delete("/delete", routeHandler.deleteBook);

/**
 * API endpoint for updating a book's info. Payload needs to have the ID of the books that needs to be updated and the data/fields that needs updating.
 */
router.put("/edit/:bookId", routeHandler.updateBook);

/**
 * API endpoint for reserving a book to be checked out from the Library desk.
 */
router.post("/reserve/:bookId", routeHandler.reserveBook);

module.exports = {router}