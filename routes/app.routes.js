module.exports = function (app) {
  const accounts = require('../accounts/accounts.controllers');
  const cases = require('../cases/cases.controllers');
  const clients = require('../clients/clients.controllers');
  const collections = require('../collections/collections.controllers');
  const contacts = require('../contacts/contacts.controllers');
  const customers = require('../customers/customers.controllers');
  const emails = require('../emails/emails.controllers');
  const outcomes = require('../outcomes/outcomes.controllers');
  const queues = require('../queues/queues.controllers');
  const reports = require('../reports/reports.controllers');
  const uploads = require('../uploads/uploads');
  const users = require('../users/users.controllers');
  //const workspace = require('../workspace/workspace.controllers');
  const workzone = require('../workzone/workzone.controllers');

  // Accounts
  app
    .route('/api/accounts/account/:accountNumber')
    .put(accounts.update_account);
  app.route('/api/accounts/account').post(accounts.insert_accounts);

  // Cases
  app.route('/api/cases/case/:caseId').put(cases.update_status);
  app.route('/api/cases/case/:caseId').post(cases.update_case);
  app.route('/api/cases/case').post(cases.insert_cases);

  // Clients
  app.route('/api/clients').get(clients.list_all);
  app.route('/api/clients/client').post(clients.create_client);

  // Check name
  app.route('/api/clients/clientCheck').post(clients.check_name);

  // Tables for new clients
  app.route('/api/clients/client/accounts').post(clients.create_accounts_table);
  app.route('/api/clients/client/cases').post(clients.create_cases_table);
  app.route('/api/clients/client/contacts').post(clients.create_contacts_table);
  app
    .route('/api/clients/client/customers')
    .post(clients.create_customers_table);
  app.route('/api/clients/client/outcomes').post(clients.create_outcomes_table);

  // Config
  app.route('/api/clients/client/config').post(clients.create_config);

  app.route('/api/clients/deactivate/:clientId').put(clients.deactivate_client);
  app.route('/api/clients/reactivate/:clientId').put(clients.reactivate_client);

  // Collections
  app.route('/api/collections').get(collections.list_all);
  app
    .route('/api/collection/:collection_id')
    .get(collections.getOneCollectionRecord);
  app
    .route('/api/collections/collection')
    .put(collections.update_one_collection);

  // Contacts
  app.route('/api/contacts/:id').get(contacts.list_all);
  app.route('/api/contacts/contact/:id').put(contacts.update_one_contact);
  app.route('/api/contacts/contact').post(contacts.insert_contacts);

  // Customers
  app.route('/api/customers/customer').post(customers.insert_customers);

  // Emails
  app.route('/api/email').post(emails.send_email);
  app.route('/api/error_email').post(emails.send_error_email);
  //app.route('/api/error_email').post(emails.send_today_email);

  // Outcomes
  app.route('/api/outcomes/:id').get(outcomes.list_all_outcomes_per_case);
  app.route('/api/outcomes/outcome/:id').post(outcomes.insert_outcome);
  app.route('/api/outcomes/outcome').post(outcomes.insert_outcomes);

  // Queues
  app.route('/api/queues').get(queues.listAll);

  // Reports
  app.route('/api/reports/:report').get(reports.getOneReport);

  // Uploads
  app.route('/api/uploads').post(uploads.upload_file);

  // Users
  app.route('/api/users/login').post(users.loginUser);
  app.route('/api/users').get(users.listAll);
  app.route('/api/users/:userId').get(users.getOne);
  app.route('/api/users/refresh').post(users.refreshToken);
  app.route('/api/users/deactivate/:userId').put(users.deactivate_user);
  app.route('/api/users/reactivate/:userId').put(users.reactivate_user);
  app.route('/api/users/user').post(users.create_user);

  // Workzone
  app.route('/api/workzone').get(workzone.list_top_five);

  // Workspace
  //app.route('/api/workspace').get(workspace.list_top_five);
};
