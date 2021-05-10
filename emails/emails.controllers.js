const Email = require('./emails.models');

// Email error
exports.send_error_email = function (req, res) {
  //console.log('Email send_error_email req.params: ', req.params);
  //console.log('Email send_error_email req.body: ', req.body);

  const purpose = req.body.purpose;
  const to = req.body.to;
  const subject = req.body.subject;
  const text = `Error: ${req.body.error}\n\rFilename: ${req.body.fileName}\n\rUser: ${req.body.user}\n\rDate and time: ${req.body.dateTime}\n\rState: ${req.body.state}\n\rPath: ${req.body.path}\n\rObject: ${req.body.object}`;
  const html = `Error: ${req.body.error}\n\rFilename: ${req.body.fileName}\n\rUser: ${req.body.user}\n\rDate and time: ${req.body.dateTime}\n\rState: ${req.body.state}\n\rPath: ${req.body.path}\n\rObject: ${req.body.object}`;

  Email.sendEmail(purpose, to, subject, text, html, function (err, email) {
    if (err) {
      console.log('Email.send_error_email controller error: ', err);
    } else {
      res.send(email);
    }
  });
};

exports.send_today = function (req, res) {
  console.log('send_today req: ', req);

  Email.sendEmail(
    req.purpose,
    req.to,
    req.subject,
    req.text,
    req.html,
    function (err, email) {
      if (err) {
        console.log('Email.send_today controller error: ', err);
      } else {
        res.send(email);
      }
    }
  );
};

exports.send_email = function (req, res) {
  //console.log('Email send_email req.params: ', req.params);
  //console.log('Email send_email req.body: ', req.body);

  const purpose = req.body.purpose;
  const to = req.body.to;
  const subject = req.body.subject;
  const text = req.body.text;
  const html = req.body.html;

  Email.sendEmail(purpose, to, subject, text, html, function (err, email) {
    if (err) {
      console.log('Email.send_email controller error: ', err);
    } else {
      res.send(email);
    }
  });
};
