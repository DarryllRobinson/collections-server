const ReportModel = require('./reports.models');

// Get any report by name
exports.getOneReport = function (req, res) {
  const { report } = req.params;
  console.log('Getting report by name', report);

  // Switch statement to determine report model to request based on report name
  switch (report) {
    case 'aging':
      ReportModel.getAging(function (err, report) {
        if (err) {
          console.log('ReportModel.getAging controller error: ', err);
        } else {
          res.send(report);
        }
      });
      break;
    case 'agentPTP':
      ReportModel.getAgentPtp(function (err, report) {
        if (err) {
          console.log('ReportModel.getAgentPtp controller error: ', err);
        } else {
          res.send(report);
        }
      });
      break;
    case 'datePTP':
      ReportModel.getDatePtp(function (err, report) {
        if (err) {
          console.log('ReportModel.getDatePtp controller error: ', err);
        } else {
          res.send(report);
        }
      });
      break;
    default:
      res.send('Report not found');
  }
};
