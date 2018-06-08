"use strict";
const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const Registration = require('./Registration_Numbers');


const app = express();
var PORT = process.env.PORT || 3000;

//   const pg = require('pg');
//   const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://coder:coder123@localhost:5432/greetings'

//  const pool = new Pool({
//   connectionString,
//   ssl: useSSL
//  });

const registration_numbers = Registration();

app.use(express.static('public'));

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(bodyParser.json());

app.engine('handlebars', exphbs({
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.get("/", function (req, res) {
    res.render('reg_number');
});

app.get("/reg_number/:numberPlate", function (req, res) {
    let numberPlate = req.params.numberPlate;
    registration_numbers.setRegistration(numberPlate);
    res.render('reg_number', {reg_numberList:registration_numbers.getMap()});
});

app.post("/reg_number", function (req, res) {
    let numberPlate = req.body.enteredReg;
    registration_numbers.setRegistration(numberPlate);
    res.render('reg_number', {reg_numberList:registration_numbers.getMap()});
});

app.get('/filterbyTown',function(req,res){
    let city =req.body.townName;
    let reg_numberList=registration_numbers.filterTowns(city);
    console.log(reg_numberList);
  res.send(reg_numberList);
 res.render('reg_number');
});

app.get('/reset',function(req,res){
   registration_numbers.clear();
res.redirect("/");
});



app.listen(PORT, function (err) {
    console.log('App starting on port', PORT)
});

function getTownname(){
 
}