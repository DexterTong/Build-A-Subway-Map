var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Index'});
});

router.get('/map', function (req, res, next) {
    res.render('map', {title: 'Build A Map', layout: false});
});

module.exports = router;
