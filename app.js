import express from "express";
import { link } from "fs";
import pg from "pg";
const app = express();
const port = 3000;

app.set('view engine','ejs');
app.use(express.static('public'));

const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "booknotes",
    password: "yASHMEET09",
    port: 5432,
});
db.connect();


app.get('/',async (req,res)=>{
    try{
        const notes = await db.query("SELECT * FROM notes")
        res.render('index',{notes: notes.rows});
    }
    catch(err){
        console.error(err.log);
    }
    
});

app.listen(port,()=>{
    console.log('3000');
});
