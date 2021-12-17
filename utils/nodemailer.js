const nodemailer = require("nodemailer");
require("dotenv").config();

const sendEmail = (options) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL, // generated ethereal user
      pass: process.env.PASSWORD, // generated ethereal password
    },
  });

  let mailOptions = {
    from: process.env.EMAIL,
    to: options.email,
    subject: options.title,
    text: options.text,
  };

  transporter.sendMail(mailOptions, (err) => {
    console.log(err);
  });
};

module.exports = { sendEmail };
