const mongoose = require("mongoose");
const Joi = require("joi");

const mapElementSchema = mongoose.Schema({
  layerName: {
    type: String,
    require: true
  },
  name: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: false
  },
  element: { type: String, require: true }
});

const validMapElement = mapElement => {
  const schema = {
    layerName: Joi.string()
      .required()
      .min(3),
    name: Joi.string().required(),
    description: Joi.string()
  };
  return Joi.validate(mapElement, schema);
};

const MapElement = mongoose.model("MapElement", mapElementSchema);

exports.mapElementSchema = mapElementSchema;
exports.MapElement = MapElement;
exports.validate = validMapElement;
