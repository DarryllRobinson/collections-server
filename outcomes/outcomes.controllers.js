const OutcomesModel = require('./outcomes.models');

// Get all outcomes for caseId provided
exports.llist_all_outcomes_per_case = function (req, res) {
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
