'use strict';
const mysql = require('mysql');
const dbConfig = require('./.stuff.js');
//console.log('dbConfig: ', dbConfig);

//console.log('process.env.NODE_ENV: ', process.env.NODE_ENV);
let config = '';

switch (process.env.REACT_APP_STAGE) {
  case 'development':
    config = dbConfig.devConfig;
    //console.log('config: ', config);
    break;
  case 'production':
    config = dbConfig.prodConfig;
    //console.log('config: ', config);
    break;
  case 'sit':
    config = dbConfig.sitConfig;
    //console.log('config: ', config);
    break;
  case 'uat':
    config = dbConfig.uatConfig;
    //console.log('config: ', config);
    break;
  default:
    config = dbConfig.devConfig;
    //console.log('config: ', config);
    break;
}

const connection = mysql.createConnection({
  host: config.host,
  user: config.user,
  port: config.port,
  password: config.password,
  database: config.database,
});

connection.connect(function (err) {
  if (err) {
    return console.error('Connection error: ' + err.message);
  }
  console.log(
    `Connected to the ${process.env.REACT_APP_STAGE} cws_admin MySQL server`
  );
});

module.exports = connection;
