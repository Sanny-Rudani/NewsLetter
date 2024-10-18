const mongoose = require("mongoose");
const PRODUCT = mongoose.model("products");
const {
  badRequestResponse,
  successResponse,
  errorResponse,
} = require("../middleware/response");

exports.product = {
  //Image upload function
  getImageOptions: function (file) {
    let pathDirectory = __dirname.split("\\");
    pathDirectory.pop();
    pathDirectory = pathDirectory.join("\\");
    const uploadedFile = file;
    const extension =
      uploadedFile.name.split(".")[uploadedFile.name.split(".").length - 1];
    const fileName = `${new Date().valueOf()}_${Math.ceil(
      Math.random() * 10000
    )}.${extension}`;
    const uploadFilePath = `${pathDirectory}/uploads/${fileName}`;
    return {
      fileName,
      uploadFilePath,
      uploadedFile,
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
        const fileInfo = this.getImageOptions(req.files.logo);
        product.logo = fileInfo.fileName;

        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath, async function (err) {
          if (err)
            return badRequestResponse(res, {
              message: "Failed to save file",
            });

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
        });
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
      const productInfo = await PRODUCT.findOne({
        _id: req.body._id,
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
        const fileInfo = this.getImageOptions(req.files.logo);
        product.logo = fileInfo.fileName;
        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath, async function (err) {
          if (err)
            return badRequestResponse(res, {
              message: "Failed to save file",
            });
          await PRODUCT.findOneAndUpdate(
            { _id: productInfo._id },
            {
              $set: product,
            }
          );
          return successResponse(res, {
            message: "Product updated successfully",
          });
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
      const company = req.query.company;
      let products = await PRODUCT.find({
        company: company,
      });
      products.map((x) => {
        if (x.logo) {
          x.logo = `${process.env.BACKEND_URL}/uploads/${x.logo}`;
        }
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
      const productInfo = await PRODUCT.findOne({
        _id: req.query.id,
      });
      if (!productInfo) {
        return badRequestResponse(res, {
          message: "Product not found",
        });
      }
      await PRODUCT.findOneAndDelete({
        _id: productInfo._id,
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
      let productInfo = await PRODUCT.findOne({
        _id: req.query.id,
        company: req.query.company,
      });
      if (!productInfo) {
        return badRequestResponse(res, {
          message: "Product not found",
        });
      }

      productInfo.logo = `${process.env.BACKEND_URL}/uploads/${productInfo.logo}`;
      return successResponse(res, {
        data: productInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
