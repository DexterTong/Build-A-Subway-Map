const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.render('mocha', { layout: false, title: 'Mocha Tests' });
});

module.exports = router;
