const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema({
  product: { type: String, required: true },
  emails: { type: [String], default: [] },
});

// Create Subscribers model
const Subscribers = mongoose.model("subscribers", newsLetterSchema);

module.exports = Subscribers;
