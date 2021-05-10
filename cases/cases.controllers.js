const CasesModel = require('./cases.models');

// Update just the currentStatus
exports.update_status = function (req, res) {
  const { id, currentStatus, lockedDateTime } = req.body;

  CasesModel.updateStatus(currentStatus, lockedDateTime, id, function (
    err,
    cases
  ) {
    if (err) {
      console.log('CasesModel.updateStatus controller error: ', err);
    } else {
      res.send(cases);
    }
  });
};
