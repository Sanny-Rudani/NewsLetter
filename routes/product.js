const express = require("express");
const router = express.Router();

const ProductController = require("../controllers/ProductController");

router.post("/add", (req, res) => ProductController.product.add(req, res));

router.get("/get", (req, res) => ProductController.product.get(req, res));

router.get("/getById", (req, res) =>
  ProductController.product.getById(req, res)
);

router.put("/update", (req, res) => ProductController.product.update(req, res));

router.delete("/delete", (req, res) =>
  ProductController.product.delete(req, res)
);

module.exports = router;
