const express = require('express');

const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Index' });
});

router.get('/map', (req, res, next) => {
  res.render('map', { title: 'Build A Subway Map' });
});

module.exports = router;
