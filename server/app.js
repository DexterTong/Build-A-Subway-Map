const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const hbs = require('hbs');

const routes = require('./routes/index');
const testRoutes = require('./routes/test');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(favicon(path.join(__dirname, '..', 'public', 'favicon.ico')));

let logFormat = 'tiny';
/* istanbul ignore if */
if (app.get('env') === 'development') {
  logFormat = 'dev';
}
/* istanbul ignore if */
if (app.get('env') !== 'test') {
  app.use(logger(logFormat));
}

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/', routes);
/* istanbul ignore if */
if (['development', 'test'].indexOf(app.get('env')) > -1) {
  app.use(express.static(path.join(__dirname, '..', 'test')));
  app.use('/test', testRoutes);
}

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers
/* istanbul ignore if */
if (app.get('env') === 'development') {
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err,
    });
  });
} else {
  app.use((err, req, res, next) => {
    /* istanbul ignore next */
    res.status(err.status || 500);
    res.render('error', {
      message: err,
      error: {},
    });
  });
}

module.exports = app;
