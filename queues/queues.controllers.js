const QueuesModel = require('./queues.models');

exports.listAll = function (req, res) {
  QueuesModel.getQueues(function (err, queues) {
    if (err) {
      console.log('QueuesModel.getQueues controller error:', err);
    } else {
      res.send(queues);
    }
  });
};
