const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const SALT_WORK_FACTOR = 10;

const servicesSchema = new mongoose.Schema(
  {
    company: { type: String, required: true },
    email: { type: String, required: true },
    appPassword: { type: String, required: true },
    service: { type: String, required: true },
    clientId: { type:String },
    clientSecret: { type: String },
    refreshToken: { type: String },
    accessToken: { type: String },
    expires: { type: Number },
    serviceClient: { type: String },
    privateKey: { type: String }
  },
  {
    timestamps: true,
  }
);

// servicesSchema.pre("save", function (next) {
//     var service = this;
//     if (!service.isModified("appPassword")) return next();
//     bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//       if (err) return next(err);
//       bcrypt.hash(service.appPassword, salt, function (err, hash) {
//         if (err) return next(err);
//         service.appPassword = hash;
//         next();
//       });
//     });
//   });
  
//   servicesSchema.pre("findOneAndUpdate", function (next) {
//     const service = this.getUpdate().$set;
//     if (!service.appPassword) {
//       next();
//     } else {
//       bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
//         if (err) {
//           return next(err);
//         }
//         bcrypt.hash(service.appPassword, salt, function (err, hash) {
//           if (err) {
//             return next(err);
//           }
//           service.appPassword = hash;
//           next();
//         });
//       });
//     }
//   });

// Create Service model
const Services = mongoose.model("services", servicesSchema);

module.exports = Services;
