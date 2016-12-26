var express = require('express');
var router = express.Router();
var pg = require('pg');
const connectionString = process.env.DATABASE_URL ||
'postgres://ymlkvvslyzhyld:bfd51c0dd3741f6c66485ca0aac482669413270ce36b5b6572c6db483a974579@ec2-54-247-120-169.eu-west-1.compute.amazonaws.com:5432/d596upqesj2slf?ssl=true';


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

router.get('/', function(req, res, next) {
    res.render('header', {});
});

router.get('/partials/:name', function(req, res) {
    res.render('partials/' + req.params.name);
});

router.get('*', function(req, res, next) {
    res.render('header', {
        title: 'Fuck',
        message: 'Estou a ir pelo outro sitio '
    });
});

module.exports = router;
