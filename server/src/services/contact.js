const route = require('express').Router();
const axios = require('axios');
const Base64 = require('js-base64').Base64;
const google = require('../clients/google');

const { secretRecaptchaKey, forwardEmail } = require('../config');
const htmlRegex = /^<.*?>$/;

function validateFormData(req, res, next) {
  const { name, email, message } = req.body;

  const validName = (name && name.length > 0 && name.length < 200 && !htmlRegex.test(name));
  const validEmail = (email && email.length > 0 && email.length < 200 && !htmlRegex.test(email));
  const validMessage = (message && message.length > 0 && message.length < 5000 && !htmlRegex.test(message));

  if (validName && validEmail && validMessage) {
    req.mail = `From: ${validEmail}\nTo: ${forwardEmail}\nSubject: Self Proclaimed Engineers Blog | ${name}\n<p>Name: ${name}</p><p>Email: ${email}</p><p>${message}</p>`;
    req.mail = Base64.encodeURI(req.mail);
    return next();
  } else {
    return res.status(400).send('Form data is invalid. Please try again.');
  }
}

async function validateRecaptcha(req, res, next) {
  const { recaptcha } = req.body;
  const address = req.connection.remoteAddress;
  const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretRecaptchaKey}&response=${recaptcha}&remoteip=${address}`;

  try {
    const response = await axios.get(url);
    if (response.data.success) {
      return next();
    }
    throw new Error();
  } catch(e) {
    return res.status(400).send('An error occurred sending email. Please try again.');
  }
}

async function sendEmail(req, res, next) {
  try {
    const client = await google.getGmailClient();

    await new Promise((resolve, reject) => {
      client.users.messages.send({
        userId: 'me',
        resource: {
          raw: req.mail
        }
      }, (err, res) => {
        if (err) {
          return reject(err);
        }

        return resolve();
      });
    });
    
  } catch(err) {
    console.log(err);
    return res.status(400).send('An error occurred sending email. Please try again.');
  } 
}

route.post('/', [validateFormData, validateRecaptcha, sendEmail], function(req, res) {
  return res.status(200).send('Your message has been sent.');
});

module.exports = route;