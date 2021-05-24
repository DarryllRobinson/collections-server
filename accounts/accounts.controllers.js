const AccountsModel = require('./accounts.models');

// Update account
exports.update_account = function (req, res) {
  console.log('update_account req.body: ' + req.body);

  AccountsModel.updateAccount(req.body, function (err, account) {
    if (err) {
      console.log('AccountsModel.updateAccount controller error: ', err);
    } else {
      res.send(account);
    }
  });
};
