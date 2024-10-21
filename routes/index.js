const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require("../middleware/auth");

const companyRoutes = require("./company");
const productRoutes = require("./product");
const newsLetterRoutes = require("./newsLetter");
const subscriberRoutes = require("./subscribers");
const blogRoutes = require("./blogs");

router.use("/company", companyRoutes);
router.use("/product", ensureAuthorized, productRoutes);
router.use("/news-letter", ensureAuthorized, newsLetterRoutes);
router.use("/subscriber", subscriberRoutes);
router.use("/blog", ensureAuthorized, blogRoutes);

module.exports = router;
