const mongoose = require("mongoose");
const BLOG = mongoose.model("blogs");

const {
  badRequestResponse,
  successResponse,
  errorResponse,
} = require("../middleware/response");
const { uploadFile } = require("../helper");

exports.blog = {
  //add blogs data
  add: async function (req, res) {
    try {
      const blog = {
        title: req.body.title,
        description: req.body.description,
        product: req.body.product,
        path: req.body.title.toLocaleLowerCase().replaceAll(" ", "-"),
        thumbnail: "",
      };
      if (req.files && Object.keys(req.files).length > 0) {
        // Save the secure URL from Cloudinary in the blog object
        const secureUrl = await uploadFile(req.files.thumbnail); // Await the uploadFile promise
        blog.thumbnail = secureUrl;

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
        path: req.body.title.toLocaleLowerCase().replaceAll(" ", "-"),
      };
      if (req.files && Object.keys(req.files).length > 0) {
        const secureUrl = await uploadFile(req.files.thumbnail); // Await the uploadFile promise
        blog.thumbnail = secureUrl;
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
      const totalCount = await BLOG.countDocuments({ product: product });
      const page = req.query.page
      let blogs = page ? await BLOG.find({
        product: product,
      }).limit(6*page) : await BLOG.find({
        product: product,
      });
      return successResponse(res, {
        totalCount: totalCount,
        rememberCount: page? totalCount-(6*page)<0 ? 0 : totalCount-(6*page) : 0,
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
