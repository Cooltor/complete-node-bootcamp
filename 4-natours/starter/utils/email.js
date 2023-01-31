const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1. Create a transporter
  const transporter = nodemailer.createTransport({
    //service: "Gmail",
    host: process.env.EMAIL_HOST, // for mailtrap
    port: process.env.EMAIL_PORT, // for Mailtrap
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
    // Activate in gmail "less secure app" option
    // Gmail limite à 100 envois par jour et peut nous mettre ds span donc c'est pas bon pour un site (grand) public
  });

  // 2. Define the email options
  const mailOptions = {
    from: 'Romain Dubus <romaindubus86@gmail.com',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html:
  };

  // 3. Actually send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
