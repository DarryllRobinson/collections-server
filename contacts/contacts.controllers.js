const ContactsModel = require('./contacts.models');

// List all contacts per account number
exports.list_all = function (req, res) {
  const { id } = req.params;
  console.log('list_all id:', id);

  ContactsModel.getContacts(id, function (err, contacts) {
    if (err) {
      console.log('ContactsModel.getContacts controller error: ', err);
    } else {
      res.send(contacts);
    }
  });
};

exports.update_one_contact = function (req, res) {
  const contact = req.body.contact;
  const { id } = contact;
  //console.log('update_one_contact id: ', id);

  ContactsModel.updateContact(id, contact, function (err, contacts) {
    if (err) {
      console.log('ContactsModel.updateContact controller error: ', err);
    } else {
      res.send(contact);
    }
  });
};
