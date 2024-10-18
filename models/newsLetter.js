const mongoose = require("mongoose");

const newsLetterSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, trim: true, default: "" },
    product: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

// Create Product model
const NewsLetter = mongoose.model("newsLetters", newsLetterSchema);

module.exports = NewsLetter;
