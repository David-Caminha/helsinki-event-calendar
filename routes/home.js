var express = require('express');
var router = express.Router();
var pg = require('pg');
const connectionString = process.env.DATABASE_URL ||
'postgres://ymlkvvslyzhyld:bfd51c0dd3741f6c66485ca0aac482669413270ce36b5b6572c6db483a974579@ec2-54-247-120-169.eu-west-1.compute.amazonaws.com:5432/d596upqesj2slf?ssl=true';

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var cloudinary = require('cloudinary');
var fs = require('fs');
//ROUTES RELATED TO CLOUDINARY ---------- START ----------

//Upload image to cloudinary
// router.post('/api/img/upload', upload.single('mainImage'), function (req, res) {
//   console.log(req.file);
//   cloudinary.uploader.upload(req.file.path, function(result){
//     console.log(result);
//   });
// });

//ROUTES RELATED TO CLOUDINARY ---------- END ----------

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
          result.rows[row].image = cloudinary.url(result.rows[row].filename);
        }
        console.log(result.rows);
        res.json(result.rows);
      }
    });
  });
});

//Create a new event
var multiUpload = upload.fields([{ name: 'mainImage', maxCount: 1 },
{ name: 'eventImage', maxCount: 1 }, { name: 'locationImage', maxCount: 1 }])
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
      cloudinary.uploader.upload(req.files.mainImage[0].path, function(cloudinaryResult){
        console.log(cloudinaryResult);
        const query2 = client.query(
          'INSERT INTO "Image"(filename , "imageLocation", "eventId") values($1, $2, $3)',
          [cloudinaryResult.public_id, 1, result.rows[0].id]
        );
        query2.on('end', function(result) {
          done();
          fs.unlink(req.files.mainImage[0].path);
        });
      });
      //UPLOAD EVENT IMAGE
      cloudinary.uploader.upload(req.files.eventImage[0].path, function(cloudinaryResult){
        console.log(cloudinaryResult);
        const query3 = client.query(
          'INSERT INTO "Image"(filename , "imageLocation", "eventId") values($1, $2, $3)',
          [cloudinaryResult.public_id, 2, result.rows[0].id]
        );
        query3.on('end', function(result) {
          done();
          fs.unlink(req.files.eventImage[0].path);
        });
      });
      //UPLOAD LOCATION IMAGE
      cloudinary.uploader.upload(req.files.locationImage[0].path, function(cloudinaryResult){
        console.log(cloudinaryResult);
        const query4 = client.query(
          'INSERT INTO "Image"(filename , "imageLocation", "eventId") values($1, $2, $3)',
          [cloudinaryResult.public_id, 4, result.rows[0].id]
        );
        query4.on('end', function(result) {
          done();
          fs.unlink(req.files.locationImage[0].path);
        });
      });
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
