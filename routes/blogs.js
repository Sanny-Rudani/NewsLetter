const express = require("express");
const router = express.Router();

const BlogsController = require("../controllers/BlogsController");
const { ensureAuthorized } = require("../middleware/auth");

router.post("/add", ensureAuthorized, (req, res) => BlogsController.blog.add(req, res));

router.get("/get", (req, res) => BlogsController.blog.get(req, res));

router.get("/getById", (req, res) => BlogsController.blog.getById(req, res));

router.put("/update", ensureAuthorized, (req, res) => BlogsController.blog.update(req, res));

router.delete("/delete", ensureAuthorized, (req, res) => BlogsController.blog.delete(req, res));

module.exports = router;
