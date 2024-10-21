const nodemailer = require("nodemailer");

const sendEmail = async (sender, email, subject, text) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      port: 465,
      auth: {
        user: process.env.gmailusername,
        pass: process.env.gmailPassword,
      },
    });

    await transporter.sendMail({
      from: process.env.gmailusername,
      replyTo: sender,
      to: email,
      subject: subject,
      html: text,
    });
    console.log("email sent sucessfully");
  } catch (error) {
    console.log("email not sent");
    console.log(error);
  }
};

module.exports = sendEmail;
