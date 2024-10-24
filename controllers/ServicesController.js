const mongoose = require("mongoose");
const {
    badRequestResponse,
    successResponse,
    errorResponse,
} = require("../middleware/response");
const { getAuthenticateCompany } = require("../helper");
const SERVICES = mongoose.model("services");

exports.service = {
    //add service
    add: async function (req, res) {
        try {
            // const service = {
            //     company: req.body.company,
            //     email: req.body.email,
            //     appPassword: req.body.appPassword,
            //     service: req.body.service
            // };

            const isCreated = await SERVICES.create(req.body);
            if (isCreated) {
                return successResponse(res, {
                    message: "Service created successfully",
                });
            } else {
                return badRequestResponse(res, {
                    message: "Failed to create service",
                });
            }
        } catch (error) {
            return errorResponse(error, req, res);
        }
    },

    //update service
    update: async function (req, res) {
        try {
            const servicesInfo = await SERVICES.findOne({
                _id: req.body._id,
            });
            if (!servicesInfo) {
                return badRequestResponse(res, {
                    message: "Services not found",
                });
            }
            // const services = {
            //     company: req.body.company,
            //     email: req.body.email,
            //     appPassword: req.body.appPassword,
            //     service: req.body.service
            // };

            await SERVICES.findOneAndUpdate(
                { _id: servicesInfo._id },
                {
                    $set: req.body,
                }
            );
            return successResponse(res, {
                message: "Services updated successfully",
            });
        } catch (error) {
            return errorResponse(error, req, res);
        }
    },

    //get service data
    get: async function (req, res) {
        try {
            const authData = getAuthenticateCompany(req);
            let services = authData?.isSuperAdmin
                ? await SERVICES.find({})
                : await SERVICES.find({
                    company: authData?.companyId,
                });

            return successResponse(res, {
                data: services,
            });
        } catch (error) {
            return errorResponse(error, req, res);
        }
    },

    //delete service data
  delete: async function (req, res) {
    try {
      const serviceInfo = await SERVICES.findOne({
        _id: req.query.id,
      });
      if (!serviceInfo) {
        return badRequestResponse(res, {
          message: "Service not found",
        });
      }
      await SERVICES.findOneAndDelete({
        _id: req.query.id,
      });
      return successResponse(res, {
        message: "Service deleted successfully",
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },

   //get service data by id
   getById: async function (req, res) {
    try {
      let serviceInfo = await SERVICES.findOne({
        _id: req.query.id,
      });
      if (!serviceInfo) {
        return badRequestResponse(res, {
          message: "Service not found",
        });
      }
      //create image url
      return successResponse(res, {
        data: serviceInfo,
      });
    } catch (error) {
      return errorResponse(error, req, res);
    }
  },
}