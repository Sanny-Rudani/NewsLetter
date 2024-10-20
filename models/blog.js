const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
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
const Blog = mongoose.model("blogs", blogSchema);

module.exports = Blog;
