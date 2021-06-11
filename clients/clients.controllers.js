const Client = require('./clients.models');

// List all clients
exports.list_all = function (req, res) {
  Client.getAll(function (err, clients) {
    if (err) {
      console.log('Client.getAll controller error: ', err);
    } else {
      res.send(clients);
    }
  });
};

// Add a client
exports.create_client = function (req, res) {
  console.log('create_client req.body: ', req.body);
  //const clientId =
  Client.addClient(req.body, function (err, client) {
    if (err) {
      console.log('addClient controller error: ', err);
    } else {
      res.send(client);
    }
  });
};
