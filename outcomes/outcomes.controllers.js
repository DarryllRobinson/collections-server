const OutcomesModel = require('./outcomes.models');

// Get all outcomes for caseId provided
exports.list_all_outcomes_per_case = function (req, res) {
  //console.log('req.params: ', req.params);
  const { id } = req.params;
  OutcomesModel.getAllOutcomesForCase(id, function (err, outcomes) {
    if (err) {
      console.log(
        'OutcomesModel.getAllOutcomesForCase controller error: ',
        err
      );
    } else {
      res.send(outcomes);
    }
  });
};

// Insert new Outcomes record
exports.insert_outcome = function (req, res) {
  const outcomeBody = req.body;

  OutcomesModel.insertNewOutcome(outcomeBody, function (err, outcome) {
    if (err) {
      console.log('OutcomesModel.insertNewOutcome controller error: ', err);
    } else {
      res.send(outcome);
    }
  });
};

// Insert new Outcomes record
exports.insert_outcomes = function (req, res) {
  const outcomesBody = req.body;
  //console.log('outcomesBody: ', outcomesBody);

  OutcomesModel.insertNewOutcomes(outcomesBody, function (err, outcomes) {
    if (err) {
      console.log('OutcomesModel.insertNewOutcomes controller error: ', err);
    } else {
      res.send(outcomes);
    }
  });
};
