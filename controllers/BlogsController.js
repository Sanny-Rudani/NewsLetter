const mongoose = require("mongoose");
const BLOG = mongoose.model("blogs");

const {
  badRequestResponse,
  successResponse,
  errorResponse,
} = require("../middleware/response");
const { uploadFile, templateRender } = require("../helper");

exports.blog = {
  //add blogs data
  add: async function (req, res) {
    try {
      const blog = {
        title: req.body.title,
        description: req.body.description,
        product: req.body.product,
        image: "",
      };
      if (req.files && Object.keys(req.files).length > 0) {
        // Save the secure URL from Cloudinary in the blog object
        const secureUrl = await uploadFile(req.files.image); // Await the uploadFile promise
        blog.image = secureUrl;

        // Create the blog entry in the database
        const isCreated = await BLOG.create(blog);
        if (isCreated) {
          // await templateRender(req.body.product, isCreated, "Blog");
          return successResponse(res, {
            message: "Blog created successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to create blog",
          });
        }
      } else {
        const isCreated = await BLOG.create(blog);
        if (isCreated) {
          // await templateRender(req.body.product, isCreated, "Blog");
          return successResponse(res, {
            message: "Blog created successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to create Blog",
          });
        }
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //update blog data
  update: async function (req, res) {
    try {
      const blogInfo = await BLOG.findOne({
        _id: req.body._id,
      });
      if (!blogInfo) {
        return badRequestResponse(res, {
          message: "Blog not found",
        });
      }
      const blog = {
        title: req.body.title,
        description: req.body.description,
        product: req.body.product,
      };
      if (req.files && Object.keys(req.files).length > 0) {
        const secureUrl = await uploadFile(req.files.image); // Await the uploadFile promise
        blog.image = secureUrl;
        await BLOG.findOneAndUpdate(
          { _id: blogInfo._id },
          {
            $set: blog,
          }
        );
        return successResponse(res, {
          message: "Blog updated successfully",
        });
        // });
      } else {
        await BLOG.findOneAndUpdate(
          { _id: blogInfo._id },
          {
            $set: blog,
          }
        );
        return successResponse(res, {
          message: "Blog updated successfully",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get blog data
  get: async function (req, res) {
    try {
      const product = req.query.product;
      let blogs = await BLOG.find({
        product: product,
      });
      return successResponse(res, {
        data: blogs,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //delete blog data
  delete: async function (req, res) {
    try {
      const blogInfo = await BLOG.findOne({
        _id: req.query.id,
      });
      if (!blogInfo) {
        return badRequestResponse(res, {
          message: "Blog not found",
        });
      }
      await BLOG.findOneAndDelete({
        _id: blogInfo._id,
      });
      return successResponse(res, {
        message: "Blog deleted successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get blog data by id
  getById: async function (req, res) {
    try {
      let blogInfo = await BLOG.findOne({
        _id: req.query.id,
        product: req.query.product,
      });
      if (!blogInfo) {
        return badRequestResponse(res, {
          message: "Blog not found",
        });
      }
      //create image url
      return successResponse(res, {
        data: blogInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
