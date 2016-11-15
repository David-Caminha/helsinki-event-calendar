var express = require('express');
var router = express.Router();

/* GET home page. */
exports.partials = function(req, res) {
    res.render('partials/' + req.params.name);
};

router.get('/', function(req, res, next) {
    res.render('header', {
        title: 'Hey',
        message: 'Sou Home'
    });
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
