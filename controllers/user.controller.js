const mongoose = require("mongoose");
const User = require("../models/user.model");

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).send("Error al obtener los usuarios: " + error.message);
    }
};

exports.updateClothesByUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("clothes");
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        user.clothes = req.body.clothes;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Error al actualizar los productos del usuario: " + error.message);
    }
};

exports.updateOutfitsByUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("outfits");
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        user.outfits = req.body.outfits;
        await user.save();
        res.status(200).json(user);
    } catch (error) {
        res.status(500).send("Error al actualizar los outfits del usuario: " + error.message);
    }
};


// Obtener el usuario actual (basado en el token)
exports.getCurrentUser = async (req, res) => {
    try {
      // Verificar si el usuario está autenticado
      if (!req.user || !req.user.id) {
        return res
          .status(400)
          .json({ message: "User ID not provided in request" });
      }
  
      const user = await User.findById(req.user.id).select("-password");
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      res.status(200).json(user);
    } catch (error) {
      console.error("Error retrieving current user:", error.message);
      res
        .status(500)
        .json({ message: "Error retrieving current user", error: error.stack });
    }
  };

exports.getClothesByUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("clothes");
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(200).json(user.clothes);
    } catch (error) {
        res.status(500).send("Error al obtener los productos: " + error.message);
    }
};

exports.getOutfitsByUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).populate("favOutfits");
        if (!user) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.status(200).json(user.favOutfits);
    } catch (error) {
        res.status(500).send("Error al obtener los outfits: " + error.message);
    }
};


