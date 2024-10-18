const mongoose = require("mongoose");
const {
  badRequestResponse,
  successResponse,
  errorResponse,
} = require("../middleware/response");
const SUBSCRIBERS = mongoose.model("subscribers");

exports.subscriber = {
  //subscribe product
  subscribe: async function (req, res) {
    try {
      let subscriberData = await SUBSCRIBERS.findOne({
        product: req.body.product,
      });
      if (!subscriberData) {
        const subscriberInfo = {
          product: req.body.product,
          emails: [req.body.email],
        };
        const isCreated = await SUBSCRIBERS.create(subscriberInfo);
        if (isCreated) {
          return successResponse(res, {
            message: "Subscriber added successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to add subscriber",
          });
        }
      } else {
        subscriberData.emails.push(req.body.email);
        const isCreated = await SUBSCRIBERS.findOneAndUpdate(
          { product: req.body.product },
          { $set: subscriberData }
        );
        if (isCreated) {
          return successResponse(res, {
            message: "Subscribers updated successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to update subscribers",
          });
        }
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //unsubscribe product
  unsubscribe: async function (req, res) {
    try {
      let subscriberData = await SUBSCRIBERS.findOne({
        product: req.body.product,
      });
      if (!subscriberData) {
        return badRequestResponse(res, {
          message: "Subcriber not found",
        });
      } else {
        const isCreated = await SUBSCRIBERS.findOneAndUpdate(
          { product: req.body.product },
          { $pull: { emails: req.body.email } }
        );
        if (isCreated) {
          return successResponse(res, {
            message: "Subscribers updated successfully",
          });
        } else {
          return badRequestResponse(res, {
            message: "Failed to update subscribers",
          });
        }
      }
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

  //get subscriber data by product
  getByProduct: async function (req, res) {
    try {
      const subscribers = await SUBSCRIBERS.findOne({
        product: req.query.product,
      });
      return successResponse(res, {
        data: subscribers,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
};
