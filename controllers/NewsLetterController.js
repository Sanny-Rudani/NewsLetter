const mongoose = require("mongoose");
const NEWS_LETTER = mongoose.model("newsLetters");
const {
  badRequestResponse,
  successResponse,
  errorResponse,
} = require("../middleware/response");
const { templateRender, uploadFile } = require("../helper");

exports.newsLetter = {
  //add news-letter data
  add: async function (req, res) {
    try {
      const newsLetter = {
        title: req.body.title,
        description: req.body.description,
        product: req.body.product,
        image: "",
      };
      if (req.files && Object.keys(req.files).length > 0) {
        // Save the secure URL from Cloudinary in the blog object
        const secureUrl = await uploadFile(req.files.image); // Await the uploadFile promise
        newsLetter.image = secureUrl;

        const isCreated = await NEWS_LETTER.create(newsLetter);
        if (isCreated) {
          await templateRender(req.body.product, isCreated, "News Letter");
          return successResponse(res, {
            message: "News Letter created successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to create news letter",
          });
        }
      } else {
        const isCreated = await NEWS_LETTER.create(newsLetter);
        if (isCreated) {
          await templateRender(req.body.product, isCreated, "News Letter");
          return successResponse(res, {
            message: "NewsLetter created successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to create NewsLetter",
          });
        }
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //update news-letter data
  update: async function (req, res) {
    try {
      const newsLetterInfo = await NEWS_LETTER.findOne({
        _id: req.body._id,
      });
      if (!newsLetterInfo) {
        return badRequestResponse(res, {
          message: "NewsLetter not found",
        });
      }
      const newsLetter = {
        title: req.body.title,
        description: req.body.description,
        product: req.body.product,
      };
      if (req.files && Object.keys(req.files).length > 0) {
        const secureUrl = await uploadFile(req.files.image); // Await the uploadFile promise
        newsLetter.image = secureUrl;
        await NEWS_LETTER.findOneAndUpdate(
          { _id: newsLetterInfo._id },
          {
            $set: newsLetter,
          }
        );
        return successResponse(res, {
          message: "NewsLetter updated successfully",
        });
      } else {
        await NEWS_LETTER.findOneAndUpdate(
          { _id: newsLetterInfo._id },
          {
            $set: newsLetter,
          }
        );
        return successResponse(res, {
          message: "NewsLetter updated successfully",
        });
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get news-letter data
  get: async function (req, res) {
    try {
      const product = req.query.product;
      let newsLetters = await NEWS_LETTER.find({
        product: product,
      });
      return successResponse(res, {
        data: newsLetters,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //delete news-letter data
  delete: async function (req, res) {
    try {
      const newsLetterInfo = await NEWS_LETTER.findOne({
        _id: req.query.id,
      });
      if (!newsLetterInfo) {
        return badRequestResponse(res, {
          message: "NewsLetter not found",
        });
      }
      await NEWS_LETTER.findOneAndDelete({
        _id: newsLetterInfo._id,
      });
      return successResponse(res, {
        message: "NewsLetter deleted successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get news-letter data by id
  getById: async function (req, res) {
    try {
      let newsLetterInfo = await NEWS_LETTER.findOne({
        _id: req.query.id,
        product: req.query.product,
      });
      if (!newsLetterInfo) {
        return badRequestResponse(res, {
          message: "NewsLetter not found",
        });
      }
      return successResponse(res, {
        data: newsLetterInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
