const express = require('express');

const router = express.Router();

router.use((req, res, next) => {
  res.locals.displayHeader = true;  // eslint-disable-line no-param-reassign
  next();
});

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Index' });
});

router.get('/map', (req, res, next) => {
  res.render('map', { title: 'Build A Subway Map', displayHeader: false });
});

module.exports = router;
