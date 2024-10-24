const { default: mongoose } = require('mongoose');
const nodemailer = require('nodemailer');
const SERVICES = mongoose.model("services");

// Updated sendEmail function
const sendEmail = async (sender, email, subject, text, company) => {
  try {

    const service = await SERVICES.aggregate([
      {
        $match: {
          company: company.toString(),
        },
      },
      {
        $addFields: {
          user: "$email",
          pass: "$appPassword",
        },
      },
      {
        $unset:
          [
            "_id",
            "email",
            "appPassword",
            "createdAt",
            "updatedAt",
            "company",
            "__v",
          ],
      },
    ]);
    if (service?.length) { // Create a transporter using only the 'service' field
    const serviceData = service?.length ? service[0] : null
    const mailService = serviceData.service
    delete serviceData.service
    // const auth = service.

      const transporter = nodemailer.createTransport({
        service: mailService, // Use service like 'gmail', 'Outlook365', 'yahoo', etc.
        auth: {
          ...serviceData
        },
      });

      // Send the email
      await transporter.sendMail({
        from: serviceData?.user, // Send from the authenticated user's email
        replyTo: sender,
        to: email,
        subject: subject,
        html: text,
      });
    } else {
      return {
        message: "Please add service to send Email",
      };
    }
    // console.log("Email sent successfully");
  } catch (error) {
    return {
      message: "Failed to send Email",
    }
  }
};

module.exports = sendEmail;