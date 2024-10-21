const jwt = require("jsonwebtoken");
const Subscribers = require("./models/subscribers");
const cloudinary = require("cloudinary").v2;
const ejs = require("ejs");
const sendEmail = require("./utils/email");
const Products = require("./models/product");
const templateFile = "./templates/newsletter.ejs";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

require("dotenv").config();

const decryptToken = (token) => {
  try {
    if (!token) throw new Error("Token is missing");
    const decoded = jwt.verify(token, process.env.secret); // Verify the token
    return decoded;
  } catch (error) {
    console.error("Error decrypting token:", error.message);
    return null; // Return null if token is invalid or expired
  }
};

async function uploadFile(file) {
  const uploadedFile = file; // Access the uploaded file

  // Directly upload the image to Cloudinary
  const result = await cloudinary.uploader.upload(
    uploadedFile.tempFilePath, // Temporary file path provided by express-fileupload
    { folder: "blogs" } // Optional: Specify folder in Cloudinary
  );

  if (result?.secure_url) {
    return result?.secure_url;
  } else {
    return badRequestResponse(res, {
      message: "Failed to save file",
    });
  }
}

async function templateRender(product, data, label) {
  const subscribers = await Subscribers.findOne({
    product: product,
  });
  const Product = await Products.findOne({
    _id: product,
  });
  data.logo = Product?.logo;
  subscribers?.emails.map((email) => {
    ejs.renderFile(
      templateFile,
      { data: data },
      async (error, renderedTemplate) => {
        if (error) {
          console.log("Error rendering template:", error);
        } else {
          // Use the renderedTemplate to send the email
          await sendEmail(
            process.env.gmailusername,
            email,
            `${Product?.name} ${label}`,
            renderedTemplate
          );
          // res.send({ text: "Hello World" });
        }
      }
    );
  });
}

module.exports = { decryptToken, uploadFile, templateRender };
