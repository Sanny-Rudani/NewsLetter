"use strict";
let mongoose = require("mongoose");

require("../models/company");
require("../models/product");
require("../models/newsLetter");
require("../models/subscribers");
require("../models/blog");

mongoose.set("debug", (collectionName, method, query, doc) => {
  console.log(`${collectionName}.${method}`, doc);
});
mongoose.Promise = global.Promise;

mongoose.connect(process.env.CONNECTION_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  tls: true,
  tlsAllowInvalidCertificates: true,
});

let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection failed"));

db.once("open", function () {
  console.log("Database connected successfully!");
});
