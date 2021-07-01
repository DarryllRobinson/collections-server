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
  console.log('create_client req.body: ', req.body);
  //const clientId =
  Client.addClient(req.body, function (err, client) {
    if (err) {
      console.log('addClient controller error: ', err);
    } else {
      //console.log('addClient controller: ', client);
      res.send(client);
    }
  });
};

// Check if name is unique
exports.check_name = function (req, res) {
  console.log('check_name req.body: ', req.body);

  Client.checkName(req.body.name, function (err, client) {
    if (err) {
      console.log('check_name error: ', err);
    } else {
      res.send(client);
    }
  });
};

// Create tables for new clients
// Accounts
exports.create_accounts_table = function (req, res) {
  console.log('create_accounts_table req.body: ', req.body);
  const tablePrefix = req.body.name.substring(0, 10);
  console.log('tablePrefix: ', tablePrefix);

  Client.createAccountsTable(tablePrefix, function (err, table) {
    if (err) {
      console.log('create_accounts_table err: ', err);
    } else {
      res.send(table);
    }
  });
};

// Cases
exports.create_cases_table = function (req, res) {
  console.log('create_cases_table req.body: ', req.body);
  const tablePrefix = req.body.name.substring(0, 10);
  console.log('tablePrefix: ', tablePrefix);

  Client.createCasesTable(tablePrefix, function (err, table) {
    if (err) {
      console.log('create_cases_table err: ', err);
    } else {
      res.send(table);
    }
  });
};

// Contacts
exports.create_contacts_table = function (req, res) {
  console.log('create_contacts_table req.body: ', req.body);
  const tablePrefix = req.body.name.substring(0, 10);
  console.log('tablePrefix: ', tablePrefix);

  Client.createContactsTable(tablePrefix, function (err, table) {
    if (err) {
      console.log('create_contacts_table err: ', err);
    } else {
      res.send(table);
    }
  });
};

// Customers
exports.create_customers_table = function (req, res) {
  console.log('create_customers_table req.body: ', req.body);
  const tablePrefix = req.body.name.substring(0, 10);
  console.log('tablePrefix: ', tablePrefix);

  Client.createCustomersTable(tablePrefix, function (err, table) {
    if (err) {
      console.log('create_customers_table err: ', err);
    } else {
      res.send(table);
    }
  });
};

// Outcomes
exports.create_outcomes_table = function (req, res) {
  console.log('create_outcomes_table req.body: ', req.body);
  const tablePrefix = req.body.name.substring(0, 10);
  console.log('tablePrefix: ', tablePrefix);

  Client.createOutcomesTable(tablePrefix, function (err, table) {
    if (err) {
      console.log('create_outcomes_table err: ', err);
    } else {
      res.send(table);
    }
  });
};

// Config
exports.create_config = function (req, res) {
  console.log('create_config req.body: ', req.body);
  const f_clientId = req.body.f_clientId;

  Client.createConfig(f_clientId, req.body, function (err, config) {
    if (err) {
      console.log('create_config err: ', err);
    } else {
      res.send(config);
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
