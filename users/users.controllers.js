const UserModel = require('./users.models');

// Login a user
exports.loginUser = function (req, res) {
  UserModel.login(req.body.email, req.body.password, function (err, user) {
    if (err) {
      console.log('UserModel.login error: ' + err);
    } else {
      //console.log('user: ' + user);
      res.send(user);
    }
  });
};

// Refresh token
exports.refreshToken = function (req, res) {
  UserModel.refreshToken(req.body, function (err, token) {
    if (err) {
      console.log('UserModel.refreshToken error: ' + err);
    } else {
      res.send(token);
    }
  });
};

// List all users
exports.listAll = function (req, res) {
  console.log('Listing users...');

  UserModel.getAllUsers(function (err, users) {
    if (err) {
      console.log('UserModel.getAllUsers controller error: ', err);
    } else {
      res.send(users);
    }
  });
};

// Get one user
exports.getOne = function (req, res) {
  const { userId } = req.params;
  console.log('Getting user...', userId);

  UserModel.getOneUser(userId, function (err, user) {
    if (err) {
      console.log('UserModel.getOneUser controller error: ', err);
    } else {
      res.send(user);
    }
  });
};

// deactivate a user
exports.deactivate_user = function (req, res) {
  console.log('deactivate_user req.params: ', req.params);
  UserModel.deactivateUser(req.params, function (err, user) {
    if (err) {
      console.log('deactivateUser controller error: ', err);
    } else {
      res.send(user);
    }
  });
};

// reactivate a user
exports.reactivate_user = function (req, res) {
  console.log('reactivate_user req.params: ', req.params);
  UserModel.reactivateUser(req.params, function (err, user) {
    if (err) {
      console.log('reactivateUser controller error: ', err);
    } else {
      res.send(user);
    }
  });
};

// Create a user
exports.create_user = function (req, res) {
  //console.log('req.body.email: ', req.body.email);
  // Check if user email address already exists
  UserModel.createUser(req.body, function (err, user) {
    if (err) {
      console.log('createUser controller error: ', err);
    } else {
      //console.log('model createUser: ', user);
      if (user === 'User exists') {
        res.send('User exists');
      } else {
        res.send(user);
      }
    }
  });
};
