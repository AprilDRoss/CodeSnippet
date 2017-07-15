const fs = require('fs');
const path = require('path');
const express = require('express');
//const models = require('./models/snippets');
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const routes = require("./routes/routes");

var session = require('express-session');

const app = express();
//Set port
app.set('port', (process.env.PORT || 3000));

app.use(express.static(path.join(__dirname,"public")));

app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache')
app.use(express.static('public'));

app.use(bodyParser.urlencoded({extended: true}));
app.use(expressValidator());
app.use(session({
  secret:'hydration',
  resave:false,
  saveUninitialized:false
}));

//app.use(routes);
app.use(routes);




app.listen(app.get('port'), function(){
console.log('App running on localhost:', app.get('port'));
});
