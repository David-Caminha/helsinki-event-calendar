var express = require('express');
var router = express.Router();
var pg = require('pg');
const connectionString = process.env.DATABASE_URL ||
'postgres://ymlkvvslyzhyld:bfd51c0dd3741f6c66485ca0aac482669413270ce36b5b6572c6db483a974579@ec2-54-247-120-169.eu-west-1.compute.amazonaws.com:5432/d596upqesj2slf?ssl=true';

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var cloudinary = require('cloudinary');
var fs = require('fs');
//HELPER FUNCTIONS RELATED TO CLOUDINARY ---------- START ----------

function updateCloudinaryAndDB(filepath, imageLocation, eventId){
  pg.connect(connectionString, (err, client, done) => {
    // Handle connection errors
    if(err) {
      done();
      console.log(err);
      return res.status(500).json({success: false, data: err});
    }
    cloudinary.uploader.upload(filepath, function(cloudinaryResult){
      var query = client.query(
        'INSERT INTO "Image"(filename , "imageLocation", "eventId") values($1, $2, $3)',
        [cloudinaryResult.public_id, imageLocation, eventId]
      );
      query.on('end', function(result) {
        done();
        fs.unlink(filepath);
      });
    });
  });
}
//HELPER FUNCTIONS RELATED TO CLOUDINARY ---------- END ----------

//ROUTES TO GET THE DATABASE INFO ---------- START ----------
//Get info for all events
router.get('/api/events', function (req, res) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('SELECT * FROM "Event", "Image" WHERE "Event".id = "Image"."eventId" AND "Image"."imageLocation" = 1', function(err, result) {
      done();
      if (err)
      {
        console.log(err);
        res.status(500).json({success: false, data: err});
      }
      else
      {
        for(var row in result.rows)
        {
          result.rows[row].imageUrl = cloudinary.url(result.rows[row].filename);
        }
        console.log(result.rows);
        res.json(result.rows);
      }
    });
  });
});

//Create a new event
var multiUpload = upload.fields([{ name: 'mainImage', maxCount: 1 },
{ name: 'eventImage', maxCount: 1 }, { name: 'locationImage', maxCount: 1 }, { name: 'speakers', maxCount: 9 }])
router.post('/api/events', multiUpload, (req, res, next) => {
  console.log("body");
  console.log(req.body);
  console.log("file");
  console.log(req.files);
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
    const query1 = client.query(
      'INSERT INTO "Event"(category , date, "infoWhat", price, "infoWho", location, timeline, title) values($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
      [data.category, data.date, data.infoWhat, data.price, data.infoWho, data.location, data.timeline, data.title]
    );
    query1.on('row', function(row, result) {
      result.addRow(row);
    });
    query1.on('end', function(result) {
      console.log('row inserted with id: ' + result.rows[0].id);
      //UPLOAD MAIN IMAGE
      updateCloudinaryAndDB(req.files.mainImage[0].path, 1, result.rows[0].id);
      //UPLOAD EVENT IMAGE
      updateCloudinaryAndDB(req.files.eventImage[0].path, 2, result.rows[0].id);
      //UPLOAD SPEAKERS IMAGES
      for(var speaker in req.files.speakers)
      {
        updateCloudinaryAndDB(req.files.speakers[speaker].path, 3, result.rows[0].id);
      }
      //UPLOAD LOCATION IMAGE
      updateCloudinaryAndDB(req.files.locationImage[0].path, 4, result.rows[0].id);
      done();
      return res.status(200).json({success: true});
    });
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

router.get('/api/images/:event_id', (req, res, next) => {
  const results = {};
  results.speakers = [];
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
    const query = client.query('SELECT * FROM "Image" WHERE "eventId"=($1)',
    [id]);
    // Stream results back one row at a time
    query.on('row', (row) => {
      row.imageUrl = cloudinary.url(row.filename);
      if(row.imageLocation === 1) {
        results['mainImage'] = row.imageUrl;
      }
      if(row.imageLocation === 2){
        results['eventImage'] = row.imageUrl;
      }
      if(row.imageLocation === 3){
        results.speakers.push(row.imageUrl);
      }
      if(row.imageLocation === 4){
        results['locationImage'] = row.imageUrl;
      }
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
