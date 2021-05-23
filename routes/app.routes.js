module.exports = function (app) {
  const accounts = require('../accounts/accounts.controllers');
  const cases = require('../cases/cases.controllers');
  const collections = require('../collections/collections.controllers');
  const contacts = require('../contacts/contacts.controllers');
  const emails = require('../emails/emails.controllers');
  const outcomes = require('../outcomes/outcomes.controllers');
  const queues = require('../queues/queues.controllers');
  const reports = require('../reports/reports.controllers');
  const users = require('../users/users.controllers');
  //const workspace = require('../workspace/workspace.controllers');
  const workzone = require('../workzone/workzone.controllers');

  // Accounts
  app.route('/api/accounts/account').put(accounts.update_account);

  // Cases
  app.route('/api/cases/case').put(cases.update_status);

  // Collections
  app.route('/api/collections').get(collections.list_top_five);
  app
    .route('/api/collection/:collection_id')
    .get(collections.getOneCollectionRecord);
  app
    .route('/api/collections/collection')
    .put(collections.update_one_collection);

  // Contacts
  app.route('/api/contacts/:id').get(contacts.list_all);
  app.route('/api/contacts/contact').post(contacts.update_one_contact);

  // Emails
  app.route('/api/email').post(emails.send_email);
  app.route('/api/error_email').post(emails.send_error_email);
  //app.route('/api/error_email').post(emails.send_today_email);

  // Outcomes
  app.route('/api/outcomes/:id').get(outcomes.llist_all_outcomes_per_case);

  // Queues
  app.route('/api/queues').get(queues.listAll);

  // Reports
  app.route('/api/reports/:report').get(reports.getOneReport);

  // Users
  app.route('/api/users/login').post(users.loginUser);
  app.route('/api/users').get(users.listAll);
  app.route('/api/users/:userId').get(users.getOne);
  app.route('/api/users/refresh').post(users.refreshToken);

  // Workzone
  app.route('/api/workzone').get(workzone.list_top_five);

  // Workspace
  //app.route('/api/workspace').get(workspace.list_top_five);
};
