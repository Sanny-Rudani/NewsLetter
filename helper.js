const jwt = require("jsonwebtoken");
const Subscribers = require("./models/subscribers");
const cloudinary = require("cloudinary").v2;
const ejs = require("ejs");
const sendEmail = require("./utils/email");
const Products = require("./models/product");
const { badRequestResponse } = require("./middleware/response");
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

// Save the secure URL from Cloudinary in the blog object
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

//email sender function
async function templateRender( product, data, label) {
  const subscribers = await Subscribers.findOne({
    product: product,
  });
  const Product = await Products.findOne({
    _id: product,
  });

  data.logo = Product?.logo;
  for (const email of subscribers?.emails) {
    try {
      const renderedTemplate = await new Promise((resolve, reject) => {
        ejs.renderFile(templateFile, { data: data }, (error, result) => {
          if (error) {
            console.log("Error rendering template:", error);
            return reject(error); // Reject the promise if there is an error
          }
          resolve(result); // Resolve the promise with the rendered template
        });
      });
  
      const response = await sendEmail(
        process.env.gmailusername,
        email,
        `${Product?.name} ${label}`,
        renderedTemplate,
        Product.company
      );
  
      
      if (response) {
        return response; // Break the loop if the response is successful (or some other condition)
      }
    } catch (error) {
      console.log("An error occurred:", error);
      return; // Optionally break the loop if an error occurs
    }
  }
}

//authenticate company
const getAuthenticateCompany = (req) => {
  const token = req.headers.authorization?.split(" ")[1];

  // Decrypt and verify the token
  const decoded = decryptToken(token);

  if (!decoded) {
    return badRequestResponse(res, {
      message: "Invalid or expired token",
    });
  }
  return {
    isSuperAdmin: decoded?.isSuperAdmin,
    companyId: decoded?._id,
  };
}

module.exports = { decryptToken, uploadFile, templateRender, getAuthenticateCompany };
