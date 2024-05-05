import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";



const app = express();
const port = 3000;



//*     Middlewear
app.use(express.static("public"));      // Main route will be public
app.use(bodyParser.urlencoded({extended: true}));       // Can use res.body to get json data
app.use(express.json());



//*     Database Connection
const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "Bookshelf",
    password: "9706",
    port: 5433,
  })
db.connect();


//* Main server 
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});


app.get("/", (req, res) => {
    res.render('index.ejs', {
        activePage: 'home',
    });
});

app.get("/add", (req, res) => {
    res.render('index.ejs', {
        activePage: 'add',
    });
});