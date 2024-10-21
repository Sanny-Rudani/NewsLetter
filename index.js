require("dotenv").config();
require("./config/db");
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const corsOptionsDelegate = require("./middleware/cors");
const fileUpload = require("express-fileupload");

app.use("/uploads", express.static("uploads"));

app.use(
  express.json({
    limit: "1024mb",
  })
);
app.use(bodyParser.json());
app.use(cors(corsOptionsDelegate));
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true, // Store files temporarily for processing
    tempFileDir: "/tmp/", // Temporary directory to store files
  })
);
// app.use(fileUpload());

const routes = require("./routes/index");
app.use("/api", routes);

app.use("/uploads", express.static("uploads"));

const port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log(`The web server has started on port ${port}`);
});
