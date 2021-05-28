const CasesModel = require('./cases.models');

// Update just the currentStatus
exports.update_status = function (req, res) {
  const caseUpdate = req.body;
  const { caseId } = req.params;

  CasesModel.updateStatus(caseId, caseUpdate, function (err, cases) {
    if (err) {
      console.log('CasesModel.updateStatus controller error: ', err);
    } else {
      res.send(cases);
    }
  });
};
