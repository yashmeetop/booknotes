import express from "express";
import { link } from "fs";
import pg from "pg";
const app = express();
const port = 3000;
import bodyParser from "body-parser";
app.set('view engine', 'ejs');
app.use(express.static('public'));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: "yASHMEET09",
    port: 5432,
});

db.connect();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
    try {
        const notes = await db.query("SELECT * FROM notes")
        res.render('index', { notes: notes.rows });
    }
    catch (err) {
        console.error(err.log);
    }

});

app.get('/new', (req, res) => {
    res.render('create');
})
app.get("/done", (req, res) => {
    res.render('done');
});
app.get('/:number', async (req, res) => {
    const number = parseInt(req.params.number, 10);
    try {
        const query = "SELECT * FROM notes WHERE id =" + number;
        const notes = await db.query(query);
        res.render('note', { notes: notes.rows });
    }
    catch (err) {
        console.error(err.log);
    }

    // if (number >= 1 && number <= 1000) {
    //   res.send(`You requested number ${number}`);
    // } else {
    //   res.status(404).send('Not Found');
    // }
});
app.post('/notes', async (req, res) => {
    const newNote = {

        title: req.body.title,
        shortsummary: req.body.shortsummary,
        content: req.body.content,
        rating: req.body.rating
    };
    // console.log(newNote);

    try {
        const query = "INSERT INTO notes (title, shortsummary, content, rating) VALUES ($1, $2, $3, $4);";
        const values = [newNote.title, newNote.shortsummary, newNote.content, newNote.rating];

        await db.query(query, values);
        res.redirect("/done");
        // alert("Your note has been successfully created");
        


    }
    catch (err) {
        console.error(err);
    }
});

app.listen(port, () => {
    console.log('3000');
});
