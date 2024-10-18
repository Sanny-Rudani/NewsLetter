const jwt = require("jsonwebtoken");

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

module.exports = { decryptToken };
