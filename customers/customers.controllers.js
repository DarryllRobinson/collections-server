const CustomersModel = require('./customers.models');

// Insert new Customers record
exports.insert_customers = function (req, res) {
  const customersBody = req.body;
  //console.log('customersBody: ', customersBody);

  CustomersModel.insertNewCustomers(customersBody, function (err, customers) {
    if (err) {
      console.log('CustomersModel.insertNewCustomers controller error: ', err);
    } else {
      res.send(customers);
    }
  });
};
