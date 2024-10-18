const mongoose = require("mongoose");
const NEWS_LETTER = mongoose.model("newsLetters");
const {
  badRequestResponse,
  successResponse,
  errorResponse,
} = require("../middleware/response");

exports.newsLetter = {
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
        const fileInfo = this.getImageOptions(req.files.image);
        newsLetter.image = fileInfo.fileName;

        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath, async function (err) {
          if (err)
            return badRequestResponse(res, {
              message: "Failed to save file",
            });

          const isCreated = await NEWS_LETTER.create(newsLetter);
          if (isCreated) {
            return successResponse(res, {
              message: "News Letter created successfully",
            });
          } else {
            return badRequestResponse(res, {
              message: "Failed to create news letter",
            });
          }
        });
      } else {
        const isCreated = await NEWS_LETTER.create(newsLetter);
        if (isCreated) {
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
        const fileInfo = this.getImageOptions(req.files.image);
        newsLetter.image = fileInfo.fileName;
        fileInfo.uploadedFile.mv(fileInfo.uploadFilePath, async function (err) {
          if (err)
            return badRequestResponse(res, {
              message: "Failed to save file",
            });
          await NEWS_LETTER.findOneAndUpdate(
            { _id: newsLetterInfo._id },
            {
              $set: newsLetter,
            }
          );
          return successResponse(res, {
            message: "NewsLetter updated successfully",
          });
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
      newsLetters.map((x) => {
        if (x.image) {
          //create image url
          x.image = `${process.env.BACKEND_URL}/uploads/${x.image}`;
        }
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
      //create image url
      newsLetterInfo.image = `${process.env.BACKEND_URL}/uploads/${newsLetterInfo.image}`;
      return successResponse(res, {
        data: newsLetterInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
