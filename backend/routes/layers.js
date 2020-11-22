const express = require("express");
const router = express.Router();
const { Layer, validate } = require("../models/layer");
const multer = require("multer");
const fs = require("fs");
const FILES_PATH = "src/assets/sounds";
const app = require("../startup/app");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, FILES_PATH);
  },
  filename: (req, file, cb) => {
    // const fileName = generateFileName(file, req);
    const fileName = `${req.body.name}.mp3`;
    cb(null, fileName);
  },
});

router.get("/", async (req, res, next) => {
  // const layers = [
  //   { id: 1, name: "river", isActive: true, status: true },
  //   { id: 2, name: "city", isActive: true, status: false },
  //   { id: 3, name: "border", isActive: true, status: true },
  //   { id: 4, name: "seas", isActive: true, status: true }
  // ];
  const userId = req.query.userId;
  if (!userId)
    return res.status(401).json({
      // message: "User dont't have a token!",
      message: "Nie jesteś zalogowany",
      maps: null,
    });
  req.body.userId = userId;
  const layers = await Layer.find().sort("name");
  if (!layers.length)
    return res.status(404).json({
      // message: "List of layers is empty!",
      message: "Lista warstw jest pusta",
      layers: null,
    });
  res.status(200).json({
    // message: "Layers fetched successfully!",
    message: "Warstwy zostały załadowane poprawnie",
    layers: layers,
  });
});
// router.get("/user/:id", async (req, res, next) => {
//   const layers = await Layer.find({ userId: req.params.id }).sort("name");
//   if (!layers.length)
//     return res.status(404).json({
//       message: "List of layers is empty!",
//       layers: null
//     });
//   res.status(200).json({
//     message: "Layers fetched successfully!",
//     layers: layers
//   });
// });
router.get("/active", async (req, res, next) => {
  const userId = req.query.userId;
  if (!userId)
    return res.status(401).json({
      // message: "User dont't have a token!",
      message: "Nie jesteś zalogowany",
      maps: null,
    });
  req.body.userId = userId;
  // const layers = await Layer.find({ userId: userId, status: true }).sort(
  const layers = await Layer.find({ status: true }).sort("name");
  if (!layers.length)
    return res.status(404).json({
      // message: "List of active layers is empty!",
      message: "Lista aktywnych warstw jest pusta!",
      layers: null,
    });
  res.status(200).json({
    // message: "Layers fetched successfully!",
    message: "Warstwy zostały załadowane poprawnie!",
    layers: layers,
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
  const layer = await Layer.findById(req.params.id);
  if (!layer)
    return res.status(404).json({
      // message: "Layer with given id doesn't exist!",
      message: "Warstwa o podanym ID nie istnieje!",
      layer: null,
    });
  res.json({ message: null, layer: layer });
});

router.post("/", multer({ storage: storage }).any(), async (req, res, next) => {
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
      layer: null,
    });
  const isIn = await findLayerByName(req.body.name, userId);
  if (isIn.length)
    return res.status(404).json({
      // message: `Layer with given name is already exist!`,
      message: `Warstwa o podanej nazwie już istnieje!`,
      layer: null,
    });
  const layer = new Layer({
    userId: userId,
    name: req.body.name,
    isActive: true,
    status: req.body.status,
    // fileName: req.body.fileName
    fileName: req.body.name,
  });
  try {
    await layer.save();
    res.json({ message: null, layer: layer });
  } catch (err) {
    res.status(500).json({ message: err.message, layer: null });
  }
});

router.put("/:id", async (req, res) => {
  console.log("put");
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
      .json({ message: error.details[0].message, layer: null });
  try {
    const prevLayer = await Layer.findById(req.params.id);
    const layer = await Layer.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      isActive: req.body.isActive,
      status: req.body.status,
      // fileName: req.body.fileName
      fileName: req.body.name,
    });
    const newLayer = await Layer.findById(req.params.id);
    if (!layer)
      return (
        res
          .status(404)
          // .json({ message: `Layer with given name not exist!`, layer: null });
          .json({
            message: `Warstwa o podanej nazwie nie istnieje!`,
            layer: null,
          })
      );
    // deleteFile(`${FILES_PATH}/${generateFileName(file,req)}`)
    fs.rename(
      `${FILES_PATH}/${prevLayer.fileName}.mp3`,
      `${FILES_PATH}/${newLayer.fileName}.mp3`,
      function (err) {
        if (err) {
          return res.json({
            // message: "File don't removed, but layer was updated!",
            message:
              "Plik nie został usunięty ale warstwa została zaktualizowana!",
            layer: newLayer,
          });
        }
        return res.json({
          // message: "Layer was updated successfully",
          message: "Warstwa została zaktualizowana poprawnie",
          layer: layer,
        });
      }
    );
    // deleteFile(`${FILES_PATH}/${prevLayer.fileName}.mp3`)
    //   ? res.json({ message: null, layer: layer })
    //   : res.json({
    //       message: "File don't removed, but layer was updated!",
    //       layer: layer
    //     });
  } catch (err) {
    res.status(500).json({ message: err.message, layer: null });
  }
});
//post when edit and sending file
router.post("/:id", multer({ storage: storage }).any(), async (req, res) => {
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
      .json({ message: error.details[0].message, layer: null });
  try {
    const prevLayer = await Layer.findById(req.params.id);
    const layer = await Layer.findByIdAndUpdate(req.params.id, {
      name: req.body.name,
      isActive: req.body.isActive,
      status: req.body.status,
      // fileName: req.body.fileName
      fileName: req.body.name,
    });
    const newLayer = await Layer.findById(req.params.id);
    if (!layer)
      return (
        res
          .status(404)
          // .json({ message: `Layer with given name not exist!`, layer: null });
          .json({
            message: `Warstwa o podanej nazwie nie istnieje!`,
            layer: null,
          })
      );
    const resp = deleteFile(`${FILES_PATH}/${prevLayer.fileName}.mp3`);
    if (resp) {
      res.json({ message: "Aktualizacja warstwy się powiodła", layer: layer });
    } else {
      res.json({
        // message: "File don't removed, but layer was updated!",
        message:
          "Plik nie został usunięty, ale warstwa została zaktualizowana poprawnie!",
        layer: layer,
      });
    }
  } catch (err) {
    res.status(500).json({ message: err.message, layer: null });
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
  const layer = await Layer.findByIdAndDelete(req.params.id);
  if (!layer)
    return (
      res
        .status(404)
        // .json({ message: `Layer with given name not exist!`, layer: null });
        .json({
          message: `Warstwa o podanej nazwie nie istnieje!`,
          layer: null,
        })
    );
  // deleteFile(`${FILES_PATH}/${generateFileName(file,req)}`)
  deleteFile(`${FILES_PATH}/${layer.fileName}.mp3`)
    ? res.json({ message: null, layer: layer })
    : // : res.json({ message: "File don't removed, but layer was!", layer: layer });
      res.json({
        message: "Plik nie został usunięty, ale warstwa tak!",
        layer: layer,
      });
});

async function findLayerByName(name, userId) {
  return await Layer.find({ userId: userId, name: name });
}
function deleteFile(path) {
  fs.unlink(path, (err) => {
    if (err) {
      console.error(err);
      return false;
    }
  });
  return true;
}
function generateFileName(file, req) {
  const name = file.originalname.toLocaleLowerCase().split(" ").join("-");
  const ext = name.substr(name.length - 3, name.length - 1);
  const fileName = `${name.substr(0, name.length - 4)}_${req.body.name}.${ext}`;
  return fileName;
}
module.exports = router;
