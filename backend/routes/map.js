const express = require("express");
const router = express.Router();
const { SvgMap, validate } = require("../models/svg-map");

router.get("/", async (req, res, next) => {
  const userId = req.query.userId;
  if (!userId)
    return res.status(401).json({
      // message: "User dont't have a token!",
      message: "Nie jesteś zalogowany",
      maps: null,
    });
  req.body.userId = userId;
  // const maps = await SvgMap.find({ userId: userId }).sort("name");
  const maps = await SvgMap.find().sort("name");
  if (!maps.length)
    return res.status(404).json({
      // message: "List of maps is empty!",
      message: "Lista map jest pusta!",
      maps: null,
    });
  res.status(200).json({
    // message: "Maps fetched successfully!",
    message: "Mapy zostały załadowane!",
    maps: maps,
  });
});

router.get("/user/:id", async (req, res, next) => {
  const userId = req.query.userId;
  if (!userId)
    return res.status(401).json({
      // message: "User dont't have a token!",
      message: "Nie jesteś zalogowany",
      maps: null,
    });
  req.body.userId = userId;
  const maps = await SvgMap.find({ userId: userId }).sort("name");
  if (!maps.length)
    return res.status(404).json({
      // message: "List of maps is empty!",
      message: "Lista map jest pusta!",
      maps: null,
    });
  res.status(200).json({
    // message: "Maps fetched successfully!",
    message: "Mapy zostały załadowane!",
    maps: maps,
  });
});

router.get("/:id", async (req, res) => {
  const userId = req.query.userId;
  if (!userId)
    return res.status(401).json({
      // message: "User dont't have a token!",
      message: "Nie jesteś zalogowany",
      maps: null,
    });
  req.body.userId = userId;
  const map = await SvgMap.findById(req.params.id);
  if (!map)
    return res.status(404).json({
      // message: "Map with given id doesn't exist!",
      message: "Mapa podanym ID nie istnieje!",
      map: null,
    });
  res.json({ message: null, map: map });
});

router.post("/", async (req, res, next) => {
  const userId = req.query.userId;
  if (!userId)
    return res.status(401).json({
      // message: "User dont't have a token!",
      message: "Nie jesteś zalogowany",
      maps: null,
    });
  req.body.userId = userId;
  const { error } = validate(req.body);
  if (error)
    return res.status(400).json({
      message: `error: ${error.details[0].message}`,
      map: null,
    });
  const isIn = await findMapByName(req.body.name);
  if (isIn.length)
    return res.status(404).json({
      // message: `Map with given name is already exist!`,
      message: `Mapa o podanej nazwie już istnieje!`,
      map: null,
    });
  const map = new SvgMap({
    userId: userId,
    name: req.body.name,
    content: req.body.content,
    mapElements: req.body.mapElements,
  });
  try {
    await map.save();
    // res.json({ message: `Map was added successfully`, map: map });
    res.json({ message: `Mapa została dodana poprawnie`, map: map });
  } catch (err) {
    res.status(500).json({ message: err.message, map: null });
  }
});

router.put("/:id", async (req, res) => {
  const userId = req.query.userId;
  if (!userId)
    return res.status(401).json({
      // message: "User dont't have a token!",
      message: "Nie jesteś zalogowany",
      maps: null,
    });
  req.body.userId = userId;
  const { error } = validate(req.body);
  if (error)
    return res
      .status(400)
      .json({ message: error.details[0].message, map: null });
  try {
    const map = await SvgMap.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      content: req.body.content,
      mapElements: req.body.mapElements,
    });
    if (!map)
      return (
        res
          .status(404)
          // .json({ message: `Map with given name not exist!`, map: null });
          .json({ message: `Mapa o podanym ID nie istnieje!`, map: null })
      );
    // res.json({ message: `Map was updated successfully`, map: map });
    res.json({ message: `Mapa została zaktualizowana poprawnie`, map: map });
  } catch (err) {
    res.status(500).json({ message: err.message, map: null });
  }
});

router.delete("/:id", async (req, res) => {
  const userId = req.query.userId;
  if (!userId)
    return res.status(401).json({
      // message: "User dont't have a token!",
      message: "Nie jesteś zalogowany",
      maps: null,
    });
  req.body.userId = userId;
  const map = await SvgMap.findByIdAndDelete(req.params.id);
  if (!map)
    return (
      res
        .status(404)
        // .json({ message: `Map with given name not exist!`, map: null });
        .json({ message: `Mapa o podanym ID nie istnieje!`, map: null })
    );
  res.json({ message: "Mapa została usunięta", map: map });
});

async function findMapByName(name) {
  return await SvgMap.find({ name: name });
}
module.exports = router;
