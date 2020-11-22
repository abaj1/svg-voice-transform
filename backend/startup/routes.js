const { json } = require("express");
const bodyParser = require("body-parser");
const layers = require("../routes/layers");
const mapElements = require("../routes/mapElements");
const maps = require("../routes/map");
const users = require("../routes/users");
// const fileUpload = require("express-fileupload");

module.exports = function (app) {
  app.use(bodyParser.json({ limit: "10mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "10mb", extended: true }));
  // app.use(fileUpload());

  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
    );
    next();
  });
  app.use("/api/layers", layers);
  app.use("/api/map-elements", mapElements);
  app.use("/api/maps", maps);
  app.use("/api/auth", users);
};
