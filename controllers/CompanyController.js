const mongoose = require("mongoose");
const COMPANY = mongoose.model("companies");
const {
  badRequestResponse,
  successResponse,
  errorResponse,
} = require("../middleware/response");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");
const { decryptToken, uploadFile } = require("../helper");

exports.company = {
  //add company or super admin
  add: async function (req, res) {
    try {
      const companyInfo = await COMPANY.findOne({
        email: req.body.email,
      });
      if (companyInfo) {
        return badRequestResponse(res, {
          message: "Email already exist!",
        });
      }
      if (req.body.password !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Password and Confirm Password must be same",
        });
      }
      const company = {
        name: req.body.name,
        email: req.body.email,
        isSuperAdmin: req.body.isSuperAdmin,
        password: req.body.password,
      };
      const token = req.headers.authorization?.split(" ")[1];

      if (req.body.isSuperAdmin || token) {
        if (req.files && Object.keys(req.files).length > 0) {
          const secureUrl = await uploadFile(req.files.logo); // Await the uploadFile promise
          company.logo = secureUrl;

          const isCreated = await COMPANY.create(company);
          if (isCreated) {
            return successResponse(res, {
              message: "Company created successfully",
            });
          } else {
            return badRequestResponse(res, {
              message: "Failed to create company",
            });
          }
        } else {
          const isCreated = await COMPANY.create(company);
          if (isCreated) {
            return successResponse(res, {
              message: "Company created successfully",
            });
          } else {
            return badRequestResponse(res, {
              message: "Failed to create company",
            });
          }
        }
      } else if (!req.body.isSuperAdmin && !token) {
        return res.status(401).json({
          message: "Auth token not found",
          isSuccess: false,
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //update company
  update: async function (req, res) {
    try {
      const companyInfo = await COMPANY.findOne({
        _id: req.body._id,
      });
      if (!companyInfo) {
        return notFoundResponse(res, {
          message: "Company not found",
        });
      }
      if (
        req.body.confirmPassword &&
        req.body.password !== req.body.confirmPassword
      ) {
        return badRequestResponse(res, {
          message: "Password and Confirm Password must be same",
        });
      }
      if (req.files && Object.keys(req.files).length > 0) {
        const company = req.body;
        const secureUrl = await uploadFile(req.files.logo); // Await the uploadFile promise
        company.logo = secureUrl;
        await COMPANY.findOneAndUpdate(
          { _id: req.body._id },
          {
            $set: company,
          }
        );
        return successResponse(res, {
          message: "Coompany updated successfully",
        });
      } else {
        await COMPANY.findOneAndUpdate(
          { _id: req.body._id },
          {
            $set: req.body,
          }
        );
        return successResponse(res, {
          message: "Coompany updated successfully",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //delete company
  delete: async function (req, res) {
    try {
      // Extract the token from the Authorization header
      const token = req.headers.authorization?.split(" ")[1];

      // Decrypt and verify the token
      const decoded = decryptToken(token);

      if (!decoded) {
        return badRequestResponse(res, {
          message: "Invalid or expired token",
        });
      }

      // Check if the company is a Super Admin
      if (decoded.isSuperAdmin) {
        const companyInfo = await COMPANY.findOne({
          _id: req.query.id,
        });
        if (!companyInfo) {
          return notFoundResponse(res, {
            message: "Company not found",
          });
        }
        await COMPANY.findOneAndDelete({
          _id: companyInfo._id,
        });
        return successResponse(res, {
          message: "Company deleted successfully",
        });
      } else {
        return badRequestResponse(res, {
          message: "Access denied: Not a Super Admin",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get company data
  get: async function (req, res) {
    try {
      const token = req.headers.authorization?.split(" ")[1];

      // Decrypt and verify the token
      const decoded = decryptToken(token);

      if (!decoded) {
        return badRequestResponse(res, {
          message: "Invalid or expired token",
        });
      }

      // Check if the user is a Super Admin
      if (decoded.isSuperAdmin) {
        let companies = await COMPANY.find({});
        return successResponse(res, {
          data: companies,
        });
      } else {
        let companies = await COMPANY.find({
          _id: decoded._id,
        });
        return successResponse(res, {
          data: companies,
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //login for super admin and company
  login: async (req, res) => {
    try {
      let adminInfo = await COMPANY.findOne({
        email: req.body.email,
      });
      if (!adminInfo) {
        return notFoundResponse(res, {
          message: "Email not found!",
        });
      }
      if (!bcrypt.compareSync(req.body.password, adminInfo.password)) {
        return badRequestResponse(res, {
          message: "Authentication failed. Wrong password.",
        });
      }

      var token = jwt.sign(adminInfo.toJSON(), process.env.secret, {
        expiresIn: "24h", // expires in 24 hours
      });
      return successResponse(res, {
        message: "You are logged in successfully!",
        token,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //forget password
  forgetPassword: async function (req, res) {
    try {
      const adminInfo = await COMPANY.findOne({
        email: req.body.email,
      });
      if (!adminInfo) {
        return notFoundResponse(res, {
          message: "admin not found!",
        });
      }
      const otpCode = this.getOtpCode();

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.gmailUserName,
          pass: process.env.gmailPassword,
        },
      });

      const emailSended = await transporter.sendMail({
        from: "Welders Math",
        to: req.body.email,
        subject: "Forget password",
        text: "We have received your forget password request",
        html: `Code: ${otpCode} <br />Otp code will be expired in 10 minutes`,
      });
      if (emailSended.accepted) {
        await COMPANY.findOneAndUpdate(
          { _id: adminInfo._id },
          {
            $set: {
              forgetPasswordOtp: otpCode,
              forgetPasswordOtpExpireTime: this.getOtpExpireTime(),
            },
          }
        );
        return successResponse(res, {
          message:
            "Forget password otp code send, please check your email account.",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to send otp code",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  // verify otp for forget password
  verifyOtpCode: async function (req, res) {
    try {
      const adminInfo = await COMPANY.findOne({
        email: req.body.email,
      });
      if (!adminInfo) {
        return notFoundResponse(res, {
          message: "Super admin not found",
        });
      }
      if (!adminInfo.forgetPasswordOtp) {
        return badRequestResponse(res, {
          message: "Please send the request for forget password first",
        });
      }
      if (new Date(adminInfo.forgetPasswordOtpExpireTime) < new Date()) {
        return badRequestResponse(res, {
          message: "Otp code is expired, please send the code again",
        });
      }
      if (adminInfo.forgetPasswordOtp != req.body.otpCode) {
        return badRequestResponse(res, {
          message: "Otp code is invalid",
        });
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Password and Confirm Password must be same",
        });
      }
      adminInfo.password = req.body.newPassword;
      await COMPANY.findOneAndUpdate(
        { _id: adminInfo._id },
        {
          $set: {
            password: adminInfo.password,
            forgetPasswordOtp: null,
            forgetPasswordOtpExpireTime: null,
          },
        }
      );
      return successResponse(res, {
        message: "Password reset successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //change company or super admin password
  changePassword: async function (req, res) {
    try {
      const adminInfo = await COMPANY.findOne({
        email: req.body.email,
      });
      if (!adminInfo) {
        return notFoundResponse(res, {
          message: "Super admin not found",
        });
      }
      if (!bcrypt.compareSync(req.body.oldPassword, adminInfo.password)) {
        return badRequestResponse(res, {
          message: "Old password should be same as new password",
        });
      }
      if (req.body.newPassword !== req.body.confirmPassword) {
        return badRequestResponse(res, {
          message: "Password and Confirm Password must be same",
        });
      }
      adminInfo.password = req.body.newPassword;
      var isUpdated = await COMPANY.findOneAndUpdate(
        { _id: adminInfo._id },
        {
          $set: {
            password: adminInfo.password,
          },
        }
      );
      if (isUpdated) {
        return successResponse(res, {
          message: "Password changed successfully",
        });
      } else {
        return badRequestResponse(res, {
          message: "Failed to update password",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get company data by id
  getById: async function (req, res) {
    try {
      let companyInfo = await COMPANY.findOne({
        _id: req.query.id,
      });
      if (!companyInfo) {
        return badRequestResponse(res, {
          message: "Company not found",
        });
      }

      return successResponse(res, {
        data: companyInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //generate OTP password function
  getOtpCode: function () {
    return parseFloat(
      `${Math.ceil(Math.random() * 5 * 100000)}`.padEnd(6, "0")
    );
  },
  getOtpExpireTime: function () {
    return new Date(new Date().getTime() + 10 * 60000);
  },
};
