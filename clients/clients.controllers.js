const Client = require('./clients.models');

// List all clients
exports.list_all = function (req, res) {
  Client.getAllClients(function (err, clients) {
    if (err) {
      console.log('Client.getAll controller error: ', err);
    } else {
      res.send(clients);
    }
  });
};

// Add a client
exports.create_client = function (req, res) {
  //console.log('create_client req.body: ', req.body);
  //const clientId =
  Client.addClient(req.body, function (err, client) {
    if (err) {
      console.log('addClient controller error: ', err);
    } else {
      //console.log('addClient controller: ', client);
      res.send('success');
    }
  });
};

// deactivate a client
exports.deactivate_client = function (req, res) {
  console.log('deactivate_client req.params: ', req.params);
  Client.deactivateClient(req.params, function (err, client) {
    if (err) {
      console.log('deactivateClient controller error: ', err);
    } else {
      res.send(client);
    }
  });
};

// reactivate a client
exports.reactivate_client = function (req, res) {
  console.log('reactivate_client req.params: ', req.params);
  Client.reactivateClient(req.params, function (err, client) {
    if (err) {
      console.log('reactivateClient controller error: ', err);
    } else {
      res.send(client);
    }
  });
};
