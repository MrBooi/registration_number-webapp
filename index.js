"use strict";
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Registration = require('./Registration_Numbers');


const app = express();
var PORT = process.env.PORT || 3000;

const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/registrationNumbers'

const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const registration_numbers = Registration(pool);

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get("/", async function (req, res, next) {
    try {
        let reglist = await registration_numbers.getMap();
        res.render('reg_number', { reglist });
    } catch (err) {
        next(err);
    }

});

app.get("/reg_number/:numberPlate", async function (req, res, next) {
    try {
        let numberPlate = req.params.numberPlate;
        await registration_numbers.setRegistration(numberPlate);
        let reglist = await registration_numbers.getMap();
        res.render('reg_number', { reglist });
    } catch (err) {
        next(err);
    }
});

app.post("/reg_number", async function (req, res, next) {
    try {
        let numberPlate = req.body.enteredReg;
        await registration_numbers.setRegistration(numberPlate);
        let reglist = await registration_numbers.getMap();
        // res.render('reg_number', { reglist });
        res.redirect('/');
    } catch (err) {
        next(err);
    }
});



app.get('/filter/:tag', async function (req, res, next) {
    try {
        let city = req.params.tag;
        let reglist = await registration_numbers.filterTowns(city);
        res.render('reg_number', {reglist});
    } catch (err) {
        next(err);
    }
});


app.get('/reset', async function (req, res, next) {
    try {
       await  registration_numbers.clear();
        res.redirect("/");
    } catch (err) {
        next(err)
    }
});


app.listen(PORT, function (err) {
    console.log('App starting on port', PORT)
});
