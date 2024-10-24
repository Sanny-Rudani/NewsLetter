const express = require("express");
const router = express.Router();

const NewsLetterController = require("../controllers/NewsLetterController");
const { ensureAuthorized } = require("../middleware/auth");

router.post("/add",ensureAuthorized, (req, res) =>
  NewsLetterController.newsLetter.add(req, res)
);

router.get("/get", (req, res) => NewsLetterController.newsLetter.get(req, res));

router.get("/getById", (req, res) =>
  NewsLetterController.newsLetter.getById(req, res)
);

router.put("/update", ensureAuthorized,(req, res) =>
  NewsLetterController.newsLetter.update(req, res)
);

router.delete("/delete",ensureAuthorized, (req, res) =>
  NewsLetterController.newsLetter.delete(req, res)
);

module.exports = router;
