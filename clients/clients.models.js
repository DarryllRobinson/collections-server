'use strict';
const sql = require('../config/db');
const Emailer = require('../emails/emails.models');

const Client = function (client) {
  this.createdDate = new Date();
};

// List all
Client.getAllClients = function (result) {
  sql.query(`SELECT * FROM cws_admin.clients;`, function (err, res) {
    if (err) {
      console.log('getAllClients error: ', err);
      result(null, err);
    } else {
      //console.log('getAllClients res: ', res);
      result(null, res);
    }
  });
};

// Create
Client.addClient = async function (client, result) {
  console.log('starting createUser: ', client);

  const name = client.name;
  const tablePrefix = name.substring(0, 10);
  client.tablePrefix = tablePrefix;

  let checkResponse = await checkName(name);
  if (checkResponse) {
    let insertResponse = await insertClient(client);
    console.log('insertResponse', insertResponse);
    if (insertResponse > 0) {
      console.log('about to create');
      let createResponse = await createTables(tablePrefix);
      if (createResponse) {
        let sendResponse = await sendWelcomeEmail(client, result);
      }
    }
  }
};

Client.createAccountsTable = function (tablePrefix, result) {
  console.log('createAccountsTable tablePrefix: ', tablePrefix);
  tableName = tablePrefix + '_accounts';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  id int NOT NULL AUTO_INCREMENT,
  accountNumber varchar(25) NOT NULL,
  accountName varchar(100) NOT NULL,
  openDate datetime DEFAULT NULL,
  debtorAge int DEFAULT '0',
  paymentTermDays int DEFAULT '0',
  creditLimit decimal(10,2) DEFAULT '0.00',
  totalBalance decimal(10,2) DEFAULT '0.00',
  amountDue decimal(10,2) DEFAULT '0.00',
  currentBalance decimal(10,2) DEFAULT '0.00',
  days30 decimal(10,2) DEFAULT '0.00',
  days60 decimal(10,2) DEFAULT '0.00',
  days90 decimal(10,2) DEFAULT '0.00',
  days120 decimal(10,2) DEFAULT '0.00',
  days150 decimal(10,2) DEFAULT '0.00',
  days180 decimal(10,2) DEFAULT '0.00',
  days180Over decimal(10,2) DEFAULT '0.00',
  paymentMethod varchar(100) DEFAULT NULL,
  paymentDueDate int DEFAULT NULL,
  debitOrderDate int DEFAULT NULL,
  lastPaymentDate datetime DEFAULT NULL,
  lastPaymentAmount decimal(10,2) DEFAULT '0.00',
  lastPTPDate datetime DEFAULT NULL,
  lastPTPAmount decimal(10,2) DEFAULT '0.00',
  accountNotes varchar(1000) DEFAULT NULL,
  currentStatus varchar(100) NOT NULL DEFAULT 'Open',
  arg varchar(45) DEFAULT NULL,
  createdDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy varchar(100) NOT NULL,
  updatedDate datetime DEFAULT NULL,
  updatedBy varchar(100) DEFAULT NULL,
  caseDate datetime DEFAULT NULL,
  f_customerId varchar(25) NOT NULL,
  PRIMARY KEY (id)
);`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('createAccountsTable error: ', err);
        result(null, err);
      } else {
        //console.log('createAccountsTable res: ', res);
        result(null, res);
      }
    }
  );
};

Client.createCasesTable = function (tablePrefix, result) {
  console.log('createCasesTable tablePrefix: ', tablePrefix);
  const tableName = tablePrefix + '_cases';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  caseId int NOT NULL AUTO_INCREMENT,
  caseNumber int DEFAULT '0',
  createdDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy varchar(100) NOT NULL,
  currentAssignment varchar(100) NOT NULL DEFAULT 'Unassigned',
  initialAssignment varchar(100) DEFAULT NULL,
  updatedDate datetime DEFAULT NULL,
  updatedBy varchar(100) DEFAULT NULL,
  reopenedDate datetime DEFAULT NULL,
  reopenedBy varchar(100) DEFAULT NULL,
  reassignedDate datetime DEFAULT NULL,
  reassignedBy varchar(100) DEFAULT NULL,
  caseNotes varchar(1000) DEFAULT NULL,
  kamNotes varchar(1000) DEFAULT NULL,
  currentStatus varchar(45) NOT NULL DEFAULT 'Open',
  nextVisitDateTime datetime DEFAULT NULL,
  pendReason varchar(100) DEFAULT NULL,
  resolution varchar(100) DEFAULT NULL,
  caseReason varchar(100) DEFAULT NULL,
  lockedDatetime datetime DEFAULT NULL,
  f_accountNumber varchar(45) NOT NULL,
  PRIMARY KEY (caseId)
)`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('createCasesTable error: ', err);
        result(null, err);
      } else {
        //console.log('createCasesTable res: ', res);
        result(null, res);
      }
    }
  );
};

Client.createContactsTable = function (tablePrefix, result) {
  console.log('createContactsTable tablePrefix: ', tablePrefix);
  const tableName = tablePrefix + '_contacts';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  id int NOT NULL AUTO_INCREMENT,
  primaryContactName varchar(100) DEFAULT NULL,
  primaryContactNumber varchar(13) DEFAULT NULL,
  primaryContactEmail varchar(100) DEFAULT NULL,
  representativeName varchar(100) DEFAULT NULL,
  representativeNumber varchar(13) DEFAULT NULL,
  representativeEmail varchar(100) DEFAULT NULL,
  alternativeRepName varchar(100) DEFAULT NULL,
  alternativeRepNumber varchar(13) DEFAULT NULL,
  alternativeRepEmail varchar(100) DEFAULT NULL,
  otherNumber1 varchar(13) DEFAULT NULL,
  otherNumber2 varchar(13) DEFAULT NULL,
  otherNumber3 varchar(13) DEFAULT NULL,
  otherNumber4 varchar(13) DEFAULT NULL,
  otherNumber5 varchar(13) DEFAULT NULL,
  otherNumber6 varchar(13) DEFAULT NULL,
  otherNumber7 varchar(13) DEFAULT NULL,
  otherNumber8 varchar(13) DEFAULT NULL,
  otherNumber9 varchar(13) DEFAULT NULL,
  otherNumber10 varchar(13) DEFAULT NULL,
  otherEmail1 varchar(100) DEFAULT NULL,
  otherEmail2 varchar(100) DEFAULT NULL,
  otherEmail3 varchar(100) DEFAULT NULL,
  otherEmail4 varchar(100) DEFAULT NULL,
  otherEmail5 varchar(100) DEFAULT NULL,
  otherEmail6 varchar(100) DEFAULT NULL,
  otherEmail7 varchar(100) DEFAULT NULL,
  otherEmail8 varchar(100) DEFAULT NULL,
  otherEmail9 varchar(100) DEFAULT NULL,
  otherEmail10 varchar(100) DEFAULT NULL,
  dnc1 varchar(100) DEFAULT NULL,
  dnc2 varchar(100) DEFAULT NULL,
  dnc3 varchar(100) DEFAULT NULL,
  dnc4 varchar(100) DEFAULT NULL,
  dnc5 varchar(100) DEFAULT NULL,
  f_accountNumber varchar(25) NOT NULL,
  PRIMARY KEY (id)
);`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('createContactsTable error: ', err);
        result(null, err);
      } else {
        //console.log('createContactsTable res: ', res);
        result(null, res);
      }
    }
  );
};

Client.createCustomersTable = function (tablePrefix, result) {
  console.log('createCustomersTable tablePrefix: ', tablePrefix);
  const tableName = tablePrefix + '_customers';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  id int NOT NULL AUTO_INCREMENT,
  operatorShortCode varchar(45) DEFAULT NULL,
  customerRefNo varchar(25) NOT NULL,
  customerName varchar(100) NOT NULL,
  customerEntity varchar(45) NOT NULL,
  regIdNumber varchar(45) DEFAULT NULL,
  customerType varchar(100) DEFAULT NULL,
  productType varchar(100) DEFAULT NULL,
  address1 varchar(45) DEFAULT NULL,
  address2 varchar(45) DEFAULT NULL,
  address3 varchar(45) DEFAULT NULL,
  address4 varchar(45) DEFAULT NULL,
  address5 varchar(45) DEFAULT NULL,
  createdBy varchar(45) NOT NULL,
  createdDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy varchar(45) DEFAULT NULL,
  updatedDate datetime DEFAULT NULL,
  closedBy varchar(45) DEFAULT NULL,
  closedDate datetime DEFAULT NULL,
  regIdStatus varchar(100) DEFAULT NULL,
  f_clientId int NOT NULL,
  PRIMARY KEY (id),
  KEY Secondary (createdBy,createdDate,updatedBy,updatedDate,regIdNumber)
);`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('createCustomersTable error: ', err);
        result(null, err);
      } else {
        //console.log('createCustomersTable res: ', res);
        result(null, res);
      }
    }
  );
};

Client.createOutcomesTable = function (tablePrefix, result) {
  console.log('createOutcomesTable tablePrefix: ', tablePrefix);
  const tableName = tablePrefix + '_outcomes';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  id int NOT NULL AUTO_INCREMENT,
  createdDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy varchar(100) NOT NULL,
  outcomeStatus varchar(45) DEFAULT 'Open',
  transactionType varchar(45) DEFAULT NULL,
  numberCalled varchar(11) DEFAULT NULL,
  emailUsed varchar(100) DEFAULT NULL,
  contactPerson varchar(100) DEFAULT NULL,
  outcomeResolution varchar(100) DEFAULT NULL,
  oldnextVisitDateTime datetime DEFAULT NULL,
  ptpDate datetime DEFAULT NULL,
  ptpAmount decimal(10,2) DEFAULT '0.00',
  debitResubmissionDate datetime DEFAULT NULL,
  debitResubmissionAmount decimal(10,2) DEFAULT '0.00',
  furtherAction varchar(45) DEFAULT NULL,
  actionDate datetime DEFAULT NULL,
  outcomeNotes varchar(1000) DEFAULT NULL,
  nextSteps varchar(1000) DEFAULT NULL,
  closedDate datetime DEFAULT NULL,
  closedBy varchar(100) DEFAULT NULL,
  f_caseId int NOT NULL,
  PRIMARY KEY (id)
);`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('createOutcomesTable error: ', err);
        result(null, err);
      } else {
        //console.log('createOutcomesTable res: ', res);
        result(null, res);
      }
    }
  );
};

const checkName = (name) => {
  console.log('running checkName: ', name);
  sql.query(
    `SELECT email FROM cws_admin.clients WHERE name = ?;`,
    name,
    function (err, res) {
      if (err) {
        console.log('addClient checkName error: ', err);
        result(null, err);
        console.log('problem with checkName: ', err);
        return false;
      } else {
        console.log('finished checkName: ', name);
      }
    }
  );
  return true;
};

const insertClient = (client) => {
  console.log('running insertClient');
  let id = 0;

  sql.query(`INSERT INTO cws_admin.clients SET ?;`, client, function (
    err,
    res
  ) {
    if (err) {
      console.log('addClient insertClient error: ', err);
      result(null, err);
      console.log('problem with insertClient: ', err);
      return 0;
    } else {
      console.log('addClient insertClient res: ', res.insertId);
      id = res.insertId;
    }
  });
  return id;
};

const createTables = (tablePrefix) => {
  // Accounts
  let tableName;
  tableName = tablePrefix + '_accounts';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  id int NOT NULL AUTO_INCREMENT,
  accountNumber varchar(25) NOT NULL,
  accountName varchar(100) NOT NULL,
  openDate datetime DEFAULT NULL,
  debtorAge int DEFAULT '0',
  paymentTermDays int DEFAULT '0',
  creditLimit decimal(10,2) DEFAULT '0.00',
  totalBalance decimal(10,2) DEFAULT '0.00',
  amountDue decimal(10,2) DEFAULT '0.00',
  currentBalance decimal(10,2) DEFAULT '0.00',
  days30 decimal(10,2) DEFAULT '0.00',
  days60 decimal(10,2) DEFAULT '0.00',
  days90 decimal(10,2) DEFAULT '0.00',
  days120 decimal(10,2) DEFAULT '0.00',
  days150 decimal(10,2) DEFAULT '0.00',
  days180 decimal(10,2) DEFAULT '0.00',
  days180Over decimal(10,2) DEFAULT '0.00',
  paymentMethod varchar(100) DEFAULT NULL,
  paymentDueDate int DEFAULT NULL,
  debitOrderDate int DEFAULT NULL,
  lastPaymentDate datetime DEFAULT NULL,
  lastPaymentAmount decimal(10,2) DEFAULT '0.00',
  lastPTPDate datetime DEFAULT NULL,
  lastPTPAmount decimal(10,2) DEFAULT '0.00',
  accountNotes varchar(1000) DEFAULT NULL,
  currentStatus varchar(100) NOT NULL DEFAULT 'Open',
  arg varchar(45) DEFAULT NULL,
  createdDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy varchar(100) NOT NULL,
  updatedDate datetime DEFAULT NULL,
  updatedBy varchar(100) DEFAULT NULL,
  caseDate datetime DEFAULT NULL,
  f_customerId varchar(25) NOT NULL,
  PRIMARY KEY (id)
);`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('Creating accounts table for new client error: ', err);
        //result(null, err);
        return false;
      } else {
        console.log('New accounts table created: ', res);
      }
    }
  );

  // Cases
  tableName = tablePrefix + '_cases';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  caseId int NOT NULL AUTO_INCREMENT,
  caseNumber int DEFAULT '0',
  createdDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy varchar(100) NOT NULL,
  currentAssignment varchar(100) NOT NULL DEFAULT 'Unassigned',
  initialAssignment varchar(100) DEFAULT NULL,
  updatedDate datetime DEFAULT NULL,
  updatedBy varchar(100) DEFAULT NULL,
  reopenedDate datetime DEFAULT NULL,
  reopenedBy varchar(100) DEFAULT NULL,
  reassignedDate datetime DEFAULT NULL,
  reassignedBy varchar(100) DEFAULT NULL,
  caseNotes varchar(1000) DEFAULT NULL,
  kamNotes varchar(1000) DEFAULT NULL,
  currentStatus varchar(45) NOT NULL DEFAULT 'Open',
  nextVisitDateTime datetime DEFAULT NULL,
  pendReason varchar(100) DEFAULT NULL,
  resolution varchar(100) DEFAULT NULL,
  caseReason varchar(100) DEFAULT NULL,
  lockedDatetime datetime DEFAULT NULL,
  f_accountNumber varchar(45) NOT NULL,
  PRIMARY KEY (caseId)
)`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('Creating cases table for new client error: ', err);
        //result(null, err);
        return false;
      } else {
        console.log('New cases table created: ', res);
      }
    }
  );

  // Contacts
  tableName = tablePrefix + '_contacts';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  id int NOT NULL AUTO_INCREMENT,
  primaryContactName varchar(100) DEFAULT NULL,
  primaryContactNumber varchar(13) DEFAULT NULL,
  primaryContactEmail varchar(100) DEFAULT NULL,
  representativeName varchar(100) DEFAULT NULL,
  representativeNumber varchar(13) DEFAULT NULL,
  representativeEmail varchar(100) DEFAULT NULL,
  alternativeRepName varchar(100) DEFAULT NULL,
  alternativeRepNumber varchar(13) DEFAULT NULL,
  alternativeRepEmail varchar(100) DEFAULT NULL,
  otherNumber1 varchar(13) DEFAULT NULL,
  otherNumber2 varchar(13) DEFAULT NULL,
  otherNumber3 varchar(13) DEFAULT NULL,
  otherNumber4 varchar(13) DEFAULT NULL,
  otherNumber5 varchar(13) DEFAULT NULL,
  otherNumber6 varchar(13) DEFAULT NULL,
  otherNumber7 varchar(13) DEFAULT NULL,
  otherNumber8 varchar(13) DEFAULT NULL,
  otherNumber9 varchar(13) DEFAULT NULL,
  otherNumber10 varchar(13) DEFAULT NULL,
  otherEmail1 varchar(100) DEFAULT NULL,
  otherEmail2 varchar(100) DEFAULT NULL,
  otherEmail3 varchar(100) DEFAULT NULL,
  otherEmail4 varchar(100) DEFAULT NULL,
  otherEmail5 varchar(100) DEFAULT NULL,
  otherEmail6 varchar(100) DEFAULT NULL,
  otherEmail7 varchar(100) DEFAULT NULL,
  otherEmail8 varchar(100) DEFAULT NULL,
  otherEmail9 varchar(100) DEFAULT NULL,
  otherEmail10 varchar(100) DEFAULT NULL,
  dnc1 varchar(100) DEFAULT NULL,
  dnc2 varchar(100) DEFAULT NULL,
  dnc3 varchar(100) DEFAULT NULL,
  dnc4 varchar(100) DEFAULT NULL,
  dnc5 varchar(100) DEFAULT NULL,
  f_accountNumber varchar(25) NOT NULL,
  PRIMARY KEY (id)
);`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('Creating contacts table for new client error: ', err);
        //result(null, err);
        return false;
      } else {
        console.log('New contacts table created: ', res);
      }
    }
  );

  // Customers
  tableName = tablePrefix + '_customers';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  id int NOT NULL AUTO_INCREMENT,
  operatorShortCode varchar(45) DEFAULT NULL,
  customerRefNo varchar(25) NOT NULL,
  customerName varchar(100) NOT NULL,
  customerEntity varchar(45) NOT NULL,
  regIdNumber varchar(45) DEFAULT NULL,
  customerType varchar(100) DEFAULT NULL,
  productType varchar(100) DEFAULT NULL,
  address1 varchar(45) DEFAULT NULL,
  address2 varchar(45) DEFAULT NULL,
  address3 varchar(45) DEFAULT NULL,
  address4 varchar(45) DEFAULT NULL,
  address5 varchar(45) DEFAULT NULL,
  createdBy varchar(45) NOT NULL,
  createdDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedBy varchar(45) DEFAULT NULL,
  updatedDate datetime DEFAULT NULL,
  closedBy varchar(45) DEFAULT NULL,
  closedDate datetime DEFAULT NULL,
  regIdStatus varchar(100) DEFAULT NULL,
  f_clientId int NOT NULL,
  PRIMARY KEY (id),
  KEY Secondary (createdBy,createdDate,updatedBy,updatedDate,regIdNumber)
);`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('Creating customers table for new client error: ', err);
        //result(null, err);
        return false;
      } else {
        console.log('New customers table created: ', res);
      }
    }
  );

  // Outcomes
  tableName = tablePrefix + '_outcomes';
  console.log('Creating new table ' + tableName);

  sql.query(
    `CREATE TABLE cws_business.?? (
  id int NOT NULL AUTO_INCREMENT,
  createdDate datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  createdBy varchar(100) NOT NULL,
  outcomeStatus varchar(45) DEFAULT 'Open',
  transactionType varchar(45) DEFAULT NULL,
  numberCalled varchar(11) DEFAULT NULL,
  emailUsed varchar(100) DEFAULT NULL,
  contactPerson varchar(100) DEFAULT NULL,
  outcomeResolution varchar(100) DEFAULT NULL,
  oldnextVisitDateTime datetime DEFAULT NULL,
  ptpDate datetime DEFAULT NULL,
  ptpAmount decimal(10,2) DEFAULT '0.00',
  debitResubmissionDate datetime DEFAULT NULL,
  debitResubmissionAmount decimal(10,2) DEFAULT '0.00',
  furtherAction varchar(45) DEFAULT NULL,
  actionDate datetime DEFAULT NULL,
  outcomeNotes varchar(1000) DEFAULT NULL,
  nextSteps varchar(1000) DEFAULT NULL,
  closedDate datetime DEFAULT NULL,
  closedBy varchar(100) DEFAULT NULL,
  f_caseId int NOT NULL,
  PRIMARY KEY (id)
);`,
    tableName,
    function (err, res) {
      if (err) {
        console.log('Creating outcomes table for new client error: ', err);
        //result(null, err);
        return false;
      } else {
        console.log('New outcomes table created: ', res);
      }
    }
  );

  // if everything works...
  return true;
};

const sendWelcomeEmail = (client, result) => {
  let href = '';
  switch (process.env.REACT_APP_STAGE) {
    case 'development':
      href = 'http://localhost:3000/';
      break;
    case 'production':
      href = 'https://thesystem.co.za/';
      break;
    case 'sit':
      href = 'https://sit.thesystem.co.za/';
      break;
    case 'uat':
      href = 'https://uat.thesystem.co.za/';
      break;
    default:
      port = 0;
      break;
  }

  Emailer.sendEmail(
    'creation',
    client.email,
    'Welcome to The System',
    'Welcome to The System',
    `
    <p>${client.mainContact}, you have been registered as a new client on The System.</p>
    <p>Please click <a href=${href} target="_blank">here</a> to be taken to the login page.</p>
    <br /><br />
    <p>The System Team</p>
  `,
    result
  );
};

// Deactivate
Client.deactivateClient = function (clientId, result) {
  console.log('deactivateClient clientId: ', clientId);
  sql.query(
    `UPDATE cws_admin.clients SET active = 0 WHERE id = ?;`,
    clientId.clientId,
    function (err, res) {
      if (err) {
        console.log('deactivateClient error: ', err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

// Reactivate
Client.reactivateClient = function (clientId, result) {
  console.log('reactivateClient clientId: ', clientId);
  sql.query(
    `UPDATE cws_admin.clients SET active = 1 WHERE id = ?;`,
    clientId.clientId,
    function (err, res) {
      if (err) {
        console.log('reactivateClient error: ', err);
        result(null, err);
      } else {
        result(null, res);
      }
    }
  );
};

module.exports = Client;
