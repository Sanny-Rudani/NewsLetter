const express = require("express");
const router = express.Router();

const ServicesController = require("../controllers/ServicesController");
const { ensureAuthorized } = require("../middleware/auth");

router.get("/get", ensureAuthorized,(req, res) =>
    ServicesController.service.get(req, res)
);

router.post("/add", ensureAuthorized, (req, res) =>
    ServicesController.service.add(req, res)
);

router.put("/update",ensureAuthorized, (req, res) =>
    ServicesController.service.update(req, res)
);

router.get("/getById",ensureAuthorized, (req, res) =>
    ServicesController.service.getById(req, res)
);

router.delete("/delete",ensureAuthorized, (req, res) =>
    ServicesController.service.delete(req, res)
);

module.exports = router;
