const express = require('express');
const bodyParser = require('body-parser');
//const port = process.env.REACT_APP_STAGE === 'development' ? 8080 : 8081;
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const mysql = require('mysql');
const app = express();
const moment = require('moment');
const jwt = require('./helpers/jwt');
const errorHandler = require('./helpers/error-handler');
const cron = require('node-cron');
const crons = require('./crons/cron.jobs');

console.log('process.env.REACT_APP_STAGE: ', process.env.REACT_APP_STAGE);
let port = 0;
switch (process.env.REACT_APP_STAGE) {
  case 'development':
    port = 8080;
    break;
  case 'production':
    port = 8081;
    break;
  case 'sit':
    port = 8082;
    break;
  case 'uat':
    port = 8083;
    break;
  default:
    port = 0;
    break;
}

console.log('port: ', port);

// enhancing security with Helmet
app.use(helmet());

// use bodyParser to parse application/json content-type
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//static folder
app.use(express.static(__dirname + '/public'));

app.use(cors());
//app.use(jwt());
// global error handler
app.use(errorHandler);

// Logging
morgan.token('user', function getUser(req) {
  return req.header('User');
});

morgan.token('ip', function getIp(req) {
  return req.ip;
});

morgan.token('body', function getBody(req) {
  return JSON.stringify(req.body);
});

app.use(
  morgan('[:date[iso]] :ip :user :method :url :status :body :response-time ms')
);

// Listen for incoming traffic
app.listen(port);

console.log('API server started on: ' + port);

const routes = require('./routes/app.routes'); //importing Routes
routes(app); //register the route

app._router.stack.forEach(function (r) {
  if (r.route && r.route.path) {
    console.log('Registered routes: ' + r.route.path);
  }
});
