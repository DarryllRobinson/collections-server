'use strict';
const sql = require('../config/db');

const Accounts = function (accounts) {
  this.createdDate = new Date();
};

Accounts.updateAccount = function (body, result) {
  console.log('Accounts body:', body);
  const {
    accountNumber,
    lastPTPAmount,
    lastPTPDate,
    updatedBy,
    updatedDate,
  } = body;

  sql.query(
    `UPDATE cws_business.accounts
    SET lastPTPAmount = ?, lastPTPDate = ?, updatedBy = ?, updatedDate = ?
    WHERE accountNumber = ?`,
    [lastPTPAmount, lastPTPDate, updatedBy, updatedDate, accountNumber],
    function (err, res) {
      if (err) {
        console.console.log('Accounts.updateAccount error:', err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Accounts;
