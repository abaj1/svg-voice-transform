const mongoose = require("mongoose");
const Joi = require("joi");

const SvgMapSchema = mongoose.Schema({
  content: {
    type: String,
    require: true,
  },
  userId: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  // mapElements: [
  //   {
  //     layerName: {
  //       type: String,
  //       require: true,
  //     },
  //     name: {
  //       type: String,
  //       require: true,
  //     },
  //     description: {
  //       type: String,
  //       require: false,
  //     },
  //     element: { type: String, require: true },
  //   },
  // ],
  mapElements: [],
});

const validSvgMap = (svgMap) => {
  const schema = {
    userId: Joi.string().required(),
    name: Joi.string().required().min(3),
    content: Joi.string().required(),
    mapElements: Joi.array(),
  };
  return Joi.validate(svgMap, schema);
};

const SvgMap = mongoose.model("SvgMap", SvgMapSchema);

exports.SvgMapSchema = SvgMapSchema;
exports.SvgMap = SvgMap;
exports.validate = validSvgMap;
