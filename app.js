const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const api = require('./routes/urls.js');

function errorHandler(err, req, res, next) {
    console.error(err);
    if (err instanceof errors.APIError){
      res.status(err.status);
      res.json({status: err.status, errorCode: err.errorCode});
    } else {
      res.status(500);
      res.json({status: 500, errorCode: 'INTERNAL_SERVER_ERROR'});
    }
  }

function invalidJsonHandler(err, req, res, next) {
    if (err) {
      throw new errors.BadRequestError();
    }
  }

app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json());
app.use(invalidJsonHandler);
app.use('/api', api);
app.use(errorHandler);

module.exports = app;
