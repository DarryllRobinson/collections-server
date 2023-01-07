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

exports.update_case = function (req, res) {
  const caseObject = req.body;
  const { caseId } = req.params;

  CasesModel.updateCase(caseObject, caseId, function (err, cases) {
    if (err) {
      console.log('CasesModel.updateCase controller error: ', err);
    } else {
      res.send(cases);
    }
  });
};

// Insert new Cases records
exports.insert_cases = function (req, res) {
  const casesBody = req.body;
  //console.log('casesBody: ', casesBody);

  CasesModel.insertNewCases(casesBody, function (err, cases) {
    if (err) {
      console.log('CasesModel.insertNewCases controller error: ', err);
    } else {
      res.send(cases);
    }
  });
};
