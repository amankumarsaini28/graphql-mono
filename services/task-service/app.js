const express = require('express');
const logger = require('morgan');
const bodyParser = require('body-parser');
const HttpStatus = require('http-status');
const TaskController = require('./controllers/TaskController');

const {
  PORT = 4001,
  VERSION = 1,
  ENV = 'dev'
} = process.env;


const app = express();

app.use(logger(ENV));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

new TaskController(app, `/api/v${VERSION}/task`);

app.use(function (err, req, res, next) {
  let response = {
    message: err.message || HttpStatus["404_MESSAGE"],
    code: err.status || HttpStatus.NOT_FOUND
  };
  res.status(err.status || HttpStatus.NOT_FOUND).json(response);
});

app.listen(
  PORT,
  () => console.log(`Express Task Service Server Now Running On localhost:${PORT}/api/v${VERSION}`)
);
