'use strict';
const sql = require('../config/db');

const Workzone = function (workzone) {
  this.createdDate = new Date();
};

Workzone.getTopFiveRecords = function (result) {
  sql.query(
    `SELECT caseId as id, accountNumber, customerName, regIdNumber, totalBalance, amountDue, currentBalance, nextVisitDateTime
    FROM cws_business.customers, cws_business.accounts, cws_business.cases
    WHERE customers.customerRefNo = accounts.f_customerId
    AND accounts.accountNumber = cases.f_accountNumber
    LIMIT 5;`,
    function (err, res) {
      if (err) {
        console.log('getTopFiveRecords error: ', err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Workzone;
