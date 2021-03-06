'use strict';
const sql = require('../config/db');

const Contacts = function (contacts) {
  this.createdDate = new Date();
};

Contacts.getContacts = function (id, result) {
  //console.log('getContacts id: ', id);

  sql.query(
    `SELECT *
    FROM cws_business.contacts
    WHERE f_accountNumber = ?;`,
    id,
    function (err, res) {
      if (err) {
        console.log('');
      } else {
        result(null, res);
      }
    }
  );
};

Contacts.updateContact = async function (id, contact, result) {
  console.log('updateContact contact: ', contact);
  const {
    primaryContactName,
    primaryContactNumber,
    primaryContactEmail,
    representativeName,
    representativeNumber,
    representativeEmail,
    alternativeRepName,
    alternativeRepNumber,
    alternativeRepEmail,
    otherNumber1,
    otherNumber2,
    otherNumber3,
    otherNumber4,
    otherNumber5,
    otherNumber6,
    otherNumber7,
    otherNumber8,
    otherNumber9,
    otherNumber10,
    otherEmail1,
    otherEmail2,
    otherEmail3,
    otherEmail4,
    otherEmail5,
    otherEmail6,
    otherEmail7,
    otherEmail8,
    otherEmail9,
    otherEmail10,
    dnc1,
    dnc2,
    dnc3,
    dnc4,
    dnc5,
  } = contact;

  let existingContact = {}; // = contact;
  if (contact) {
    if (primaryContactName)
      existingContact.primaryContactName = primaryContactName;
    if (primaryContactNumber)
      existingContact.primaryContactNumber = primaryContactNumber;
    if (primaryContactEmail)
      existingContact.primaryContactEmail = primaryContactEmail;
    if (representativeName)
      existingContact.representativeName = representativeName;
    if (representativeNumber)
      existingContact.representativeNumber = representativeNumber;
    if (representativeEmail)
      existingContact.representativeEmail = representativeEmail;
    if (alternativeRepName)
      existingContact.alternativeRepName = alternativeRepName;
    if (alternativeRepNumber)
      existingContact.alternativeRepNumber = alternativeRepNumber;
    if (alternativeRepEmail)
      existingContact.alternativeRepEmail = alternativeRepEmail;
    if (otherNumber1) existingContact.otherNumber1 = otherNumber1;
    if (otherNumber2) existingContact.otherNumber2 = otherNumber2;
    if (otherNumber3) existingContact.otherNumber3 = otherNumber3;
    if (otherNumber4) existingContact.otherNumber4 = otherNumber4;
    if (otherNumber5) existingContact.otherNumber5 = otherNumber5;
    if (otherNumber6) existingContact.otherNumber6 = otherNumber6;
    if (otherNumber7) existingContact.otherNumber7 = otherNumber7;
    if (otherNumber8) existingContact.otherNumber8 = otherNumber8;
    if (otherNumber9) existingContact.otherNumber9 = otherNumber9;
    if (otherNumber10) existingContact.otherNumber10 = otherNumber10;
    if (otherEmail1) existingContact.otherEmail1 = otherEmail1;
    if (otherEmail2) existingContact.otherEmail2 = otherEmail2;
    if (otherEmail3) existingContact.otherEmail3 = otherEmail3;
    if (otherEmail4) existingContact.otherEmail4 = otherEmail4;
    if (otherEmail5) existingContact.otherEmail5 = otherEmail5;
    if (otherEmail6) existingContact.otherEmail6 = otherEmail6;
    if (otherEmail7) existingContact.otherEmail7 = otherEmail7;
    if (otherEmail8) existingContact.otherEmail8 = otherEmail8;
    if (otherEmail9) existingContact.otherEmail9 = otherEmail9;
    if (otherEmail10) existingContact.otherEmail10 = otherEmail10;
    if (dnc2) existingContact.dnc2 = dnc1;
    if (dnc2) existingContact.dnc2 = dnc2;
    if (dnc3) existingContact.dnc3 = dnc3;
    if (dnc4) existingContact.dnc4 = dnc4;
    if (dnc5) existingContact.dnc5 = dnc5;
  }

  // Bulk update
  let arr = [];
  arr.push(existingContact);
  console.log('arr', arr);

  await bulkUpdate('contacts', arr, id, function (err, res) {
    if (err) {
      console.log('bulkUpdate error for Contacts.updateContact: ' + err);
      result(null, err);
    } else {
      result(null, res);
    }
  });
};

async function bulkUpdate(table, objectArray, id, callback) {
  let keys = Object.keys(objectArray[0]);
  let values = [];
  objectArray.map((obj) =>
    keys.map((key) => {
      if (key !== 'id') {
        if (obj[key] === 'NULL') obj[key] = null;
        obj[key] = ` ${key} = "${obj[key]}"`;
      }
      values.push(obj[key]);
    })
  );

  // determining which identifier to use based on the table name
  let identifier = '';
  switch (table) {
    case 'customers':
      identifier = 'customerRefNo';
      break;
    case 'accounts':
      identifier = 'accountNumber';
      break;
    case 'contacts':
      identifier = 'f_accountNumber';
      break;
    case 'cases':
      identifier = 'caseId';
      break;
    default:
      identifier = 'id';
      break;
  }

  // UPDATE {table} SET colname = ?, ...    WHERE id = ?;
  let sqlstatement = `UPDATE cws_business.${table} SET ${values} WHERE ${identifier} = "${id}";`;
  console.log('sqlstatement: ', sqlstatement);
  await sql.query(sqlstatement, function (error, results, fields) {
    if (error) return callback(error);
    callback(null, results);
  });
}

Contacts.insertNewContacts = async function (contactsBody, result) {
  try {
    await bulkInsert(
      'cws_business.contacts',
      contactsBody,
      (error, response) => {
        if (error) {
          console.log('insertNewContacts error: ', error);
          error.json({
            error_code: 1,
            err_desc: error,
            data: null,
          });
        }
        console.log(`Successful insert of ${response.affectedRows} rows`);
        result(null, response);
      }
    );
  } catch (e) {
    console.log('insertNewContacts problem (e): ', e);
    return res.json({
      error_code: 1,
      err_desc: err,
      data: null,
    });
  }
};

async function bulkInsert(table, objectArray, callback) {
  let keys = [];
  let values = [];
  // check if objectArray is longer than one element
  if (objectArray.length > 1) {
    const numElements = objectArray.length;
    keys = Object.keys(objectArray[0][0]);
    //let values = [];
    for (let i = 0; i < numElements; i++) {
      let elementValues = objectArray[i].map((obj) =>
        keys.map((key) => obj[key])
      );
      //console.log('elementValues: ', elementValues[0]);
      values.push(elementValues[0]);
    }
    //console.log('values: ', values);
  } else {
    keys = Object.keys(objectArray[0]);
    //console.log('keys: ', keys);
    values = objectArray.map((obj) => keys.map((key) => obj[key]));
  }

  // replace 'NULL' with NULL
  values.map((outside) => {
    outside.forEach(function (e, i) {
      if (e === 'NULL') {
        outside[i] = null;
      }
    });
  });

  let sqlstatement =
    'INSERT INTO ' + table + ' (' + keys.join(', ') + ') VALUES ? ';
  //console.log('[values]: ', values);
  //console.log('sqlstatement: ', sqlstatement);
  await sql.query(sqlstatement, [values], function (error, results, fields) {
    console.log('results: ', results);
    if (error) return callback(error);
    callback(null, results);
  });
}

module.exports = Contacts;
