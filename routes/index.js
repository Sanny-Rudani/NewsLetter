const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require("../middleware/auth");

const companyRoutes = require("./company");
const productRoutes = require("./product");
const newsLetterRoutes = require("./newsLetter");
const subscriberRoutes = require("./subscribers");
const blogRoutes = require("./blogs");
const servicesRoutes = require("./services")

router.use("/company", companyRoutes);
router.use("/product", ensureAuthorized, productRoutes);
router.use("/news-letter", newsLetterRoutes);
router.use("/subscriber", subscriberRoutes);
router.use("/blog", ensureAuthorized, blogRoutes);
router.use("/service", servicesRoutes);

module.exports = router;
