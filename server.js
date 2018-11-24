var express = require('express');
var app = express();
require('dotenv').config();

//use path static resource files
app.use(express.static('assets'));
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

var port = process.env.PORT || 3000;

//wake up http server
var http = require('http');

//Enable to receive requests access to the specified port
var server = http.createServer(app).listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get('/', function (req, res) {
  res.render('./index.ejs', {
    googleApiKey: process.env.GOOGLE_API_KEY
  });
});