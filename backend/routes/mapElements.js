const express = require("express");
const router = express.Router();
const { MapElement, validate } = require("../models/mapElement");

router.get("/", async (req, res, next) => {
  // const layers = [
  //   { id: 1, name: "river", isActive: true, status: true },
  //   { id: 2, name: "city", isActive: true, status: false },
  //   { id: 3, name: "border", isActive: true, status: true },
  //   { id: 4, name: "seas", isActive: true, status: true }
  // ];
  const mapElements = await MapElement.find().sort("name");
  if (!mapElements.length)
    return res.status(404).json({
      message: "List of map elements is empty",
      mapElements: null
    });
  res.status(200).json({
    message: "Map elements fetched successfully!",
    mapElements: mapElements
  });
});

router.get("/:id", async (req, res) => {
  const mapElement = await MapElement.findById(req.params.id);
  if (!mapElement)
    return res.status(404).json({
      message: "Map Element with given ID don't exist!",
      mapElements: null
    });
  res.json({
    message: null,
    mapElements: mapElements
  });
});

router.post("/", async (req, res, next) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      message: `error: ${error.details[0].message}`,
      mapElement: null
    });
  const isIn = await findMapElementByName(req.body.name);
  if (isIn.length)
    return res.status(404).json({
      message: `Map Element with given name is already exist!`,
      mapElements: null
    });
  const mapElement = new MapElement({
    layerName: req.body.layerName,
    name: req.body.name,
    description: req.body.description ? req.body.description : ""
  });
  try {
    await mapElement.save();
    res.json({
      message: `Map Element is successfull added!`,
      mapElements: mapElement
    });
  } catch (err) {
    res.status(500).json({ message: err.message, mapElement: null });
  }
});

router.put("/:id", async (req, res) => {
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      message: `error: ${error.details[0].message}`,
      mapElement: null
    });
  try {
    const mapElement = await MapElement.findByIdAndUpdate(req.params.id, {
      layerName: req.body.layerName,
      name: req.body.name,
      description: req.body.description ? req.body.description : ""
    });
    if (!mapElement)
      return res.status(404).json({
        message: `Map Element with given name not exist!`,
        mapElement: null
      });
    res.json({
      message: null,
      mapElement: mapElement
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      mapElement: null
    });
  }
});

router.delete("/:id", async (req, res) => {
  const mapElement = await MapElement.findByIdAndDelete(req.params.id);
  if (!mapElement)
    return res
      .status(404)
      .json({
        message: `Map Element with given name not exist!`,
        mapElement: null
      });
  res.json({
    message: "Map element successfully deleted",
    mapElement: mapElement
  });
});

async function findMapElementByName(name) {
  return await MapElement.find({ name: name });
}
module.exports = router;
