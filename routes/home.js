var express = require('express');
var router = express.Router();
var pg = require('pg');
const connectionString = process.env.DATABASE_URL ||
'postgres://ymlkvvslyzhyld:bfd51c0dd3741f6c66485ca0aac482669413270ce36b5b6572c6db483a974579@ec2-54-247-120-169.eu-west-1.compute.amazonaws.com:5432/d596upqesj2slf?ssl=true';

//ROUTES TO GET THE DATABASE INFO ---------- START ----------
//Get info for all events
router.get('/api/events', function (req, res) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM "Event"', function(err, result) {
      done();
      if (err)
      {
        console.log(err);
        res.status(500).json({success: false, data: err});
      }
      else
      {
        res.json(result.rows);
      }
    });
  });
});

//Create a new event
router.post('/api/events', (req, res, next) => {
  const results = [];
  // Grab data from http request
  const data = {title: req.body.title,
    category: req.body.category,
    date: req.body.date,
    infoWhat: req.body.infoWhat,
    price: req.body.price,
    infoWho: req.body.infoWho,
    location: req.body.location,
    timeline: req.body.timeline
  };
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Insert Data
    console.log("title " + data.title); console.log("category " + data.category); console.log("date " + data.date); console.log("what " + data.infoWhat);
    console.log("price " + data.price); console.log("who " + data.infoWho); console.log("location " + data.location); console.log("timeline " + data.timeline);
    client.query('INSERT INTO "Event"(category , date, "infoWhat", price, "infoWho", location, timeline, title) values($1, $2, $3, $4, $5, $6, $7, $8)',
    [data.category, data.date, data.infoWhat, data.price, data.infoWho, data.location, data.timeline, data.title]);
  });
});

//Get info for a specific event by id
router.get('/api/events/:event_id', (req, res, next) => {
  const results = [];
  // Grab data from the URL parameters
  const id = req.params.event_id;
  // Get a Postgres client from the connection pool
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    // SQL Query > Select Data
    const query = client.query('SELECT * FROM "Event" WHERE id=($1)',
    [id]);
    // Stream results back one row at a time
    query.on('row', (row) => {
      results.push(row);
    });
    // After all data is returned, close connection and return results
    query.on('end', function() {
      done();
      return res.json(results);
    });
  });
});
//ROUTES TO GET THE DATABASE INFO ---------- END ----------


//ROUTES FOR THE WEBSITE ITSELF ---------- START ----------
router.get('/', function(req, res, next) {
  res.render('header', {});
});

router.get('/partials/:name', function(req, res) {
  res.render('partials/' + req.params.name);
});

router.get('*', function(req, res, next) {
  res.render('header', {});
});
//ROUTES FOR THE WEBSITE ITSELF ---------- END ----------

module.exports = router;
