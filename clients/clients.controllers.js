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

// Create tables for new clients
// Accounts
exports.create_accounts_table = function (req, res) {
  console.log('create_accounts_table req.params: ', req.params);
  console.log('create_accounts_table req.body: ', req.body);

  Client.createAccountsTable(req.body, function (err, table) {
    if (err) {
      console.log('create_accounts_table err: ', err);
    } else {
      result(null, res);
    }
  });
};

// Cases
exports.create_cases_table = function (req, res) {
  console.log('create_cases_table req.params: ', req.params);
  console.log('create_cases_table req.body: ', req.body);

  Client.createCasesTable(req.body, function (err, table) {
    if (err) {
      console.log('create_cases_table err: ', err);
    } else {
      result(null, res);
    }
  });
};

// Contacts
exports.create_contacts_table = function (req, res) {
  console.log('create_contacts_table req.params: ', req.params);
  console.log('create_contacts_table req.body: ', req.body);

  Client.createContactsTable(req.body, function (err, table) {
    if (err) {
      console.log('create_contacts_table err: ', err);
    } else {
      result(null, res);
    }
  });
};

// Customers
exports.create_customers_table = function (req, res) {
  console.log('create_customers_table req.params: ', req.params);
  console.log('create_customers_table req.body: ', req.body);

  Client.createCustomersTable(req.body, function (err, table) {
    if (err) {
      console.log('create_customers_table err: ', err);
    } else {
      result(null, res);
    }
  });
};

// Outcomes
exports.create_outcomes_table = function (req, res) {
  console.log('create_outcomes_table req.params: ', req.params);
  console.log('create_outcomes_table req.body: ', req.body);

  Client.createOutcomesTable(req.body, function (err, table) {
    if (err) {
      console.log('create_outcomes_table err: ', err);
    } else {
      result(null, res);
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
