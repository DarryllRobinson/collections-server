const AccountsModel = require('./accounts.models');

// Update account
exports.update_account = function (req, res) {
  const account = req.body;
  const { accountNumber } = req.params;

  AccountsModel.updateAccount(accountNumber, account, function (err, account) {
    if (err) {
      console.error('AccountsModel.updateAccount controller error: ', err);
    } else {
      res.send(account);
    }
  });
};
