const express = require("express");
var http = require('http');
var io = require('socket.io');
const expressHbs = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require('path');

const booksRouter = require("./controllers/books/router").router;

var app = express();
http = http.Server(app);
io = io(http);

const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public')));
app.use(bodyParser.json());
app.engine('.hbs', expressHbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

app.get("/", (req, res) => {
    res.render("index", {title: "eLibrary - Book Reservation System"});
});

app.use("/books", booksRouter);
http.listen(port, port => {
    console.log(`Server listening at port: ${port}\nYou can visit the server here: http://localhost:3000`);
});

io.on('connection', socket => {
    var username = null;
    console.log("New User Connected");
    socket.on("new_message", data => {
        console.log(data);
        socket.broadcast.emit("new_message", {message: data.message});
    });

    socket.on("username", data => {
        username = data.username;
    });
});
