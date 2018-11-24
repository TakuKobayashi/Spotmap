var express = require('express');
var app = express();
require('dotenv').config();

var Meshitero = require(__dirname + '/meshitero.js');
var meshitero = new Meshitero();

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
    googleApiKey: process.env.GOOGLE_APIKEY
  });
});

app.get('/api/foods', function (req, res) {
  meshitero.requestGooglePlace({
    latitude: 35.6275767,
    longitude: 135.0608655
  }).then(function (response) {
    var results = response.body.results.map(function (place) {
      return {
        name: place.name,
        lat: place.geometry.location.lat,
        lon: place.geometry.location.lng,
        image: place.icon,
        rating: place.rating,
        address: place.vicinity
      }
    });
    console.log(results);
    res.json(results);
  });
});