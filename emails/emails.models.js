'use strict';
const nodemailer = require('nodemailer');
const constants = require('../config/.stuff.js');

// async..await is not allowed in global scope, must use a wrapper
const Emailer = async function (email) {
  console.log('email in const: ', email);
};

Emailer.sendEmail = async function (purpose, to, subject, text, html, result) {
  // create reusable transporter object using the default SMTP transport
  let transporter = nodemailer.createTransport({
    host: 'mail.thesystem.co.za',
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'robot@thesystem.co.za', // generated ethereal user
      pass: constants.emailPass, // generated ethereal password
    },
  });

  // send mail with defined transport object
  let info = await transporter.sendMail({
    from: 'robot@thesystem.co.za', // sender address
    to: to, // list of receivers
    subject: subject, // Subject line
    text: text, // plain text body
    html: html, // html body
  });

  //console.log("Message sent: %s", info.messageId);
  console.log('Message sent to: %s', info);
  result(null, 'Email sent successfully');
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  // Preview only available when sending through an Ethereal account
  //console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
  // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
};

Emailer().catch(console.error);

module.exports = Emailer;
