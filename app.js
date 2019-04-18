const express = require("express");
const expressHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require('path');

var app = express();

app.use(express.static(path.join(__dirname, '/public')));

const booksRouter = require("./controllers/books/router").router;

const port = process.env.PORT || 3000;

app.use(bodyParser.json());

app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get("/", (req, res) => {
    res.render("index", {title: "eLibrary - Book Reservation System"});
});

app.use("/books", booksRouter);
app.listen(port, port => {console.log(`Server listening at port: ${port}\n You visit the server here: http://localhost:3000`);})