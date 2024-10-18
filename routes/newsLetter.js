const express = require("express");
const router = express.Router();

const NewsLetterController = require("../controllers/NewsLetterController");

router.post("/add", (req, res) =>
  NewsLetterController.newsLetter.add(req, res)
);

router.get("/get", (req, res) => NewsLetterController.newsLetter.get(req, res));

router.get("/getById", (req, res) =>
  NewsLetterController.newsLetter.getById(req, res)
);

router.put("/update", (req, res) =>
  NewsLetterController.newsLetter.update(req, res)
);

router.delete("/delete", (req, res) =>
  NewsLetterController.newsLetter.delete(req, res)
);

module.exports = router;
