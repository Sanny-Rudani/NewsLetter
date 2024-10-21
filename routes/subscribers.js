const express = require("express");
const router = express.Router();

const SubscriberController = require("../controllers/SubscribersController");
const rateLimiter = require("../middleware/rateLimiter");

const limit = parseInt(process.env.RATE_LIMIT) || 5;
const timeWindow = parseInt(process.env.TIME_WINDOW) || 30000;

router.post("/subscribe", rateLimiter(limit, timeWindow), (req, res) =>
  SubscriberController.subscriber.subscribe(req, res)
);

router.post("/unsubscribe", rateLimiter(limit, timeWindow), (req, res) =>
  SubscriberController.subscriber.unsubscribe(req, res)
);

router.get("/getByProduct", (req, res) =>
  SubscriberController.subscriber.getByProduct(req, res)
);

module.exports = router;
