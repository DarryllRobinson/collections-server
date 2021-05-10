'use strict';
const sql = require('../config/db');

const Queues = function (queues) {
  this.createdDate = new Date();
};

Queues.getQueues = function (result) {
  sql.query(
    `SELECT caseId as id, currentStatus, currentAssignment
    FROM cws_business.cases;`,
    function (err, res) {
      if (err) {
        console.log('getQueues error: ', err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Queues;
