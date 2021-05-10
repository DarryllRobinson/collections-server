const WorkzoneModel = require('./workzone.models');

// List top five workzone records
exports.list_top_five = function (req, res) {
  WorkzoneModel.getTopFiveRecords(function (err, workzone) {
    if (err) {
      console.log('WorkzoneModel.getTopFiveRecords controller error: ', err);
    } else {
      res.send(workzone);
    }
  });
};
