const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const SALT_WORK_FACTOR = 10;

// Define Company schema
const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isSuperAdmin: { type: Boolean, default: false },
    logo: { type: String, trim: true, default: "" },
    forgetPasswordOtp: {
      type: Number,
    },
    forgetPasswordOtpExpireTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

companySchema.pre("save", function (next) {
  var user = this;
  if (!user.isModified("password")) return next();
  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function (err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

companySchema.pre("findOneAndUpdate", function (next) {
  const user = this.getUpdate().$set;
  if (!user.password) {
    next();
  } else {
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) {
        return next(err);
      }
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }
});

companySchema.methods.comparePassword = function (candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

// Create Company model
const Companies = mongoose.model("companies", companySchema);

module.exports = Companies;
