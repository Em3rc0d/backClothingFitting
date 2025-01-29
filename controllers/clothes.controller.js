const fs = require("fs");
const path = require("path");
const multer = require("multer");
const multerS3 = require("multer-s3")
const Jimp = require("jimp");
const Clothes = require("../models/clothes.model");
const User = require("../models/user.model");
const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");

// Configuración de AWS S3 (con SDK v3)
const s3 = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

// Configuración de Multer con S3
const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.BUCKET_NAME,
    acl: "public-read",
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, `images/${Date.now()}_${file.originalname}`);
    },
    contentType: multerS3.AUTO_CONTENT_TYPE, // Se establece automáticamente el Content-Type
  }),
});


// Controlador para crear una prenda
exports.createClothes = async (req, res) => {
  upload.single("image")(req, res, async (err) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error al subir la imagen: " + err.message });
    }

    try {
      const { brand, category, userId } = req.body;

      if (!brand || !category || !userId) {
        return res
          .status(400)
          .json({
            message: "Faltan datos obligatorios (brand, category, userId).",
          });
      }

      if (!req.file || !req.file.location) {
        return res.status(400).json({ message: "La imagen es obligatoria." });
      }

      const imageURL = req.file.location; // URL pública de la imagen en S3

      const newClothes = new Clothes({
        brand,
        image: imageURL,
        category,
      });

      await newClothes.save();

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }

      user.clothes.push(newClothes._id);
      await user.save();

      res.status(201).json({
        message: "Prenda creada y asignada al usuario exitosamente.",
        newClothes,
      });
    } catch (error) {
      res
        .status(500)
        .json({ message: "Error al crear la prenda: " + error.message });
    }
  });
};

// Controlador para eliminar una prenda
exports.deleteClothes = async (req, res) => {
  try {
    const deletedClothes = await Clothes.findByIdAndDelete(req.params.id);

    if (!deletedClothes) {
      return res.status(404).send("Prenda no encontrada.");
    }

    res.status(200).send("Prenda eliminada exitosamente.");
  } catch (error) {
    res.status(500).send("Error al eliminar la prenda: " + error.message);
  }
};

// Controlador para actualizar una prenda
exports.updateClothes = async (req, res) => {
  try {
    const updatedClothes = await Clothes.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedClothes) {
      return res.status(404).send("Prenda no encontrada.");
    }

    res.status(200).json(updatedClothes);
  } catch (error) {
    res.status(500).send("Error al actualizar la prenda: " + error.message);
  }
};

// Obtener prendas por categoría
exports.getClothesByCategory = async (req, res) => {
  try {
    const clothes = await Clothes.find({ category: req.params.category });

    if (!clothes.length) {
      return res
        .status(404)
        .send("No se encontraron prendas en esta categoría.");
    }

    res.status(200).json(clothes);
  } catch (error) {
    res.status(500).send("Error al obtener las prendas: " + error.message);
  }
};

// Controlador para recuperar imagen de S3
exports.getClothesImage = async (req, res) => {
  try {
    const clothes = await Clothes.findById(req.params.id);

    if (!clothes || !clothes.image) {
      return res.status(404).send("Imagen no encontrada.");
    }

    const imageUrl = clothes.image;
    const imageKey = imageUrl.split("/").pop(); // Obtener el nombre del archivo de la URL

    const params = {
      Bucket: process.env.BUCKET_NAME,
      Key: `images/${imageKey}`,
    };

    // Obtener la imagen desde S3 usando el SDK v3
    const data = await s3.send(new GetObjectCommand(params));

    // Establecer el tipo de contenido (puedes hacerlo dinámicamente según el tipo de imagen)
    res.set("Content-Type", "image/jpeg");

    // Enviar los datos binarios de la imagen al cliente
    data.Body.pipe(res);
  } catch (error) {
    res.status(500).send("Error al obtener la imagen: " + error.message);
  }
};