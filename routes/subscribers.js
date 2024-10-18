const express = require("express");
const router = express.Router();

const SubscriberController = require("../controllers/SubscribersController");

router.post("/subscribe", (req, res) =>
  SubscriberController.subscriber.subscribe(req, res)
);

router.post("/unsubscribe", (req, res) =>
  SubscriberController.subscriber.unsubscribe(req, res)
);

router.get("/getByProduct", (req, res) =>
  SubscriberController.subscriber.getByProduct(req, res)
);

module.exports = router;
