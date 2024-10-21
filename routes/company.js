const express = require("express");
const router = express.Router();
const { ensureAuthorized } = require("../middleware/auth");

const CompanyController = require("../controllers/CompanyController");

router.get("/get", ensureAuthorized, (req, res) =>
  CompanyController.company.get(req, res)
);

router.get("/getById", ensureAuthorized, (req, res) =>
  CompanyController.company.getById(req, res)
);

router.put("/update", ensureAuthorized, (req, res) =>
  CompanyController.company.update(req, res)
);

router.delete("/delete", ensureAuthorized, (req, res) =>
  CompanyController.company.delete(req, res)
);

router.post("/add", (req, res) => CompanyController.company.add(req, res));

router.post("/login", (req, res) => CompanyController.company.login(req, res));

router.post("/forgetPassword", (req, res) =>
  CompanyController.company.forgetPassword(req, res)
);

router.post("/verifyOtpCode", (req, res) =>
  CompanyController.company.verifyOtpCode(req, res)
);

router.post("/changePassword", (req, res) =>
  CompanyController.company.changePassword(req, res)
);

module.exports = router;
