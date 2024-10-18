const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    company: { type: String, required: true },
    logo: { type: String, trim: true, default: "" },
  },
  {
    timestamps: true,
  }
);

// Create Product model
const Products = mongoose.model("products", productSchema);

module.exports = Products;
