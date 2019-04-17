const app = require("express")();
const bodyParser = require("body-parser");

const booksRouter = require("./controllers/books/router").router;

var port = 3000;

app.use(bodyParser.json());
app.get("/", (req, res) => {
    res.send("<h2>Hello MobInspire</h2>");
});

app.use("/books", booksRouter);
app.listen(port, port => {console.log(`Server listening at port: ${port}\n You visit the server here: http://localhost:3000`);})