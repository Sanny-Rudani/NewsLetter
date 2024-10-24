const mongoose = require("mongoose");
const PRODUCT = mongoose.model("products");
const {
  badRequestResponse,
  successResponse,
  errorResponse,
} = require("../middleware/response");
const { decryptToken, uploadFile } = require("../helper");

exports.product = {
  getAuthenticateCompany: function (req) {
    const token = req.headers.authorization?.split(" ")[1];

    // Decrypt and verify the token
    const decoded = decryptToken(token);

    if (!decoded) {
      return badRequestResponse(res, {
        message: "Invalid or expired token",
      });
    }
    return {
      isSuperAdmin: decoded?.isSuperAdmin,
      companyId: decoded?._id,
    };
  },

  //add product
  add: async function (req, res) {
    try {
      const product = {
        company: req.body.company,
        name: req.body.name,
        email: req.body.email,
        logo: "",
      };
      if (req.files && Object.keys(req.files).length > 0) {
        // Save the secure URL from Cloudinary in the blog object
        const secureUrl = await uploadFile(req.files.logo); // Await the uploadFile promise
        product.logo = secureUrl;

        const isCreated = await PRODUCT.create(product);
        if (isCreated) {
          return successResponse(res, {
            message: "Product created successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to create product",
          });
        }
      } else {
        const isCreated = await PRODUCT.create(product);
        if (isCreated) {
          return successResponse(res, {
            message: "Product created successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to create product",
          });
        }
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //update product data
  update: async function (req, res) {
    try {
      const authData = this.getAuthenticateCompany(req);
      const productInfo = authData?.isSuperAdmin
        ? await PRODUCT.findOne({
            _id: req.body._id,
          })
        : await PRODUCT.findOne({
            _id: req.body._id,
            company: authData?.companyId,
          });
      if (!productInfo) {
        return badRequestResponse(res, {
          message: "Product not found",
        });
      }
      const product = {
        company: req.body.company,
        name: req.body.name,
        email: req.body.email,
      };
      if (req.files && Object.keys(req.files).length > 0) {
        // Save the secure URL from Cloudinary in the blog object
        const secureUrl = await uploadFile(req.files.logo); // Await the uploadFile promise
        product.logo = secureUrl;
        await PRODUCT.findOneAndUpdate(
          { _id: productInfo._id },
          {
            $set: product,
          }
        );
        return successResponse(res, {
          message: "Product updated successfully",
        });
      } else {
        await PRODUCT.findOneAndUpdate(
          { _id: productInfo._id },
          {
            $set: product,
          }
        );
        return successResponse(res, {
          message: "Product updated successfully",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get product data
  get: async function (req, res) {
    try {
      // const company = req.query.company;
      const authData = this.getAuthenticateCompany(req);
      let products = authData?.isSuperAdmin
        ? await PRODUCT.find({})
        : await PRODUCT.find({
            company: authData?.companyId,
          });

      return successResponse(res, {
        data: products,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //delete product data
  delete: async function (req, res) {
    try {
      const authData = this.getAuthenticateCompany(req);
      const productInfo = authData?.isSuperAdmin
        ? await PRODUCT.findOne({
            _id: req.query.id,
          })
        : await PRODUCT.findOne({
            _id: req.query.id,
            company: authData?.companyId,
          });
      if (!productInfo) {
        return badRequestResponse(res, {
          message: "Product not found",
        });
      }
      authData?.isSuperAdmin
        ? await PRODUCT.findOneAndDelete({
            _id: req.query.id,
          })
        : await PRODUCT.findOneAndDelete({
            _id: req.query.id,
            company: authData?.companyId,
          });
      return successResponse(res, {
        message: "Product deleted successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get product data by id
  getById: async function (req, res) {
    try {
      const authData = this.getAuthenticateCompany(req);
      let productInfo = authData?.isSuperAdmin
        ? await PRODUCT.findOne({
            _id: req.query.id,
          })
        : await PRODUCT.findOne({
            _id: req.query.id,
            company: authData?.companyId,
          });
      if (!productInfo) {
        return badRequestResponse(res, {
          message: "Product not found",
        });
      }

      return successResponse(res, {
        data: productInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
