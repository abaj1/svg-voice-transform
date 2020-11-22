const mongoose = require("mongoose");
// const MongoClient = require("mongodb").MongoClient;
//const logger = require("../startup/logging")();
module.exports = function () {
  mongoose
    // .connect("mongodb://localhost/svg-maps", {
    .connect(
      "mongodb+srv://lcabaj:XGcyL99B0ShAOIcB@cluster0.c2m9e.mongodb.net/svg-maps?retryWrites=true&w=majority",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }
    )
    // .then(() => logger.info("Connected to the vidly db..."));
    .then(() => console.log("Connected to the svg-map db..."))
    .catch((err) => console.log(err));
};
