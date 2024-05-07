import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';



const app = express();
const port = 3000;
const saltRounds = 10;


//*     Middlewear
app.use(express.static("public"));      // Main route will be public
app.use(bodyParser.urlencoded({extended: true}));       // Can use res.body to get json data
app.use(express.json());
dotenv.config();

//*     Database Connection
const db = new pg.Client({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: String(process.env.DB_PASSWORD),
    port: parseInt(process.env.DB_PORT)
  })
db.connect();


//* Main server 
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});

//? Homepage
app.get("/", (req, res) => {
    res.render('index.ejs', {
        activePage: 'home',
    });
});

//? Register 
app.get("/register", (req, res) => {
    res.render('register.ejs', {
        activePage: 'login',
    })
})

//? Check user info (Username and Email) if they exist in Users DB
app.post("/check-registration", async (req, res) => {
    const { username, email } = req.body;
    
    try {
        const result = await db.query(`
            SELECT 
                (SELECT COUNT(*) FROM users WHERE username = $1) AS username_count,
                (SELECT COUNT(*) FROM users WHERE email = $2) AS email_count
        `, [username, email]);
        
        const validUser = parseInt(result.rows[0].username_count) === 0;
        const validEmail = parseInt(result.rows[0].email_count) === 0;

        console.log('Valid User - '+validUser+'\nValid Email - ' + validEmail);

        if (validUser && validEmail) {
            res.status(200).json({ unique: true, my_message: "Username and Email are unique" });
        } else if (!validUser && !validEmail) {
            res.status(400).json({ unique: false, my_message: "Both Username and Email are taken" });
        } else if (!validUser) {
            res.status(400).json({ unique: false, my_message: "Username is taken" });
        } else {
            res.status(400).json({ unique: false, my_message: "Email is taken" });
        }
    } catch (error) {
        console.error("Database error:", error);
        res.status(500).json({ unique: false, message: "Database error. Please try again later." });
    }
});

//? Registering user into users DB
app.post("/register", async (req, res) => {
    const {username, password, email} = req.body
    console.log('Registering')
    try{
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const response = await db.query(`
        INSERT INTO users(username, hashed_password, email) 
        VALUES($1, $2, $3)
    `, [username, hashedPassword, email]);

    res.redirect('/login?success=1');

    } catch (error) {
        console.error("Error registering user:", error);
        res.status(500).json({ message: "Error registering user" });
    }
})

app.get("/login", (req, res) => {
    res.render('login.ejs', {
        activePage: 'login',
        success: req.query.success,
    });
});

app.post("/login", (req, res) => {
    let username = req.body.username;
    let password = req.body.password;



    res.render('login.ejs', {
        activePage: 'login',
    })
});


app.get("/add", (req, res) => {
    res.render('add.ejs', {
        activePage: 'add',
    });
});