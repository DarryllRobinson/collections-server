'use strict';
const sql = require('../config/db');

const Report = function (report) {
  this.createdDate = new Date();
};

Report.getAging = function (result) {
  sql.query(
    `SELECT SUM(currentBalance) AS 'Current',
    SUM(days30) AS '30',
    SUM(days60) AS '60',
    SUM(days90) AS '90',
    SUM(days120) AS '120',
    SUM(days150) AS '150',
    SUM(days180) AS '180',
    SUM(days180Over) AS '>180'
    FROM cws_business.accounts;`,
    function (err, res) {
      if (err) {
        console.log('getAging error: ', err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

Report.getAgentPtp = function (result) {
  sql.query(
    `SELECT createdBy as Agent, SUM(ptpAmount) as Sum
    FROM cws_business.outcomes
    GROUP BY createdBy;`,
    function (err, res) {
      if (err) {
        console.log('getAgentPtp error: ', err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

Report.getDatePtp = function (result) {
  sql.query(
    `SELECT substring(ptpDate, 1, 10)  as PTPDate, SUM(ptpAmount) as Sum
    FROM cws_business.outcomes
    WHERE ptpDate IS NOT NULL
    GROUP BY ptpDate;`,
    function (err, res) {
      if (err) {
        console.log('getDatePtp error: ', err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Report;
