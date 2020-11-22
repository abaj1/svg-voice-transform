const mongoose = require("mongoose");
const Joi = require("joi");

const layerSchema = mongoose.Schema({
  userId: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  isActive: {
    type: Boolean,
    require: true,
  },
  status: {
    type: Boolean,
    require: true,
  },
  fileName: {
    type: String,
    require: true,
  },
});

const validLayers = (layer) => {
  const schema = {
    userId: Joi.string().required(),
    name: Joi.string().min(3).required(),
    isActive: Joi.boolean().required(),
    status: Joi.boolean().required(),
    fileName: Joi.string().required(),
  };
  return Joi.validate(layer, schema);
};

const Layer = mongoose.model("Layer", layerSchema);

exports.layerSchema = layerSchema;
exports.Layer = Layer;
exports.validate = validLayers;
