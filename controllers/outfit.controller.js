const Outfit = require("../models/outfit.model");
const Clothes = require("../models/clothes.model");

exports.createOutfit = async (req, res) => {
    try {
        const { clothes, description } = req.body;
        const newOutfit = new Outfit({ clothes, description });
        await newOutfit.save();
        res.status(201).json(newOutfit);
    } catch (error) {
        res.status(500).send("Error al crear el outfit: " + error.message);
    }
};

exports.getOutfits = async (req, res) => {
    try {
        const outfits = await Outfit.find().populate("clothes");
        res.status(200).json(outfits);
    } catch (error) {
        res.status(500).send("Error al obtener los outfits: " + error.message);
    }
};

exports.getOutfitById = async (req, res) => {
    try {
        const outfit = await Outfit.findById(req.params.id).populate("clothes");
        if (!outfit) {
            return res.status(404).send("Outfit no encontrado");
        }
        res.status(200).json(outfit);
    } catch (error) {
        res.status(500).send("Error al obtener el outfit: " + error.message);
    }
};

exports.getLastOutfit = async (req, res) => {
    try {
        const lastOutfit = await Outfit.findOne().sort({ createdAt: -1 }).populate("clothes");
        if (!lastOutfit) {
            return res.status(404).send("No se encontraron outfits");
        }
        res.status(200).json(lastOutfit);
    } catch (error) {
        res.status(500).send("Error al obtener el outfit: " + error.message);
    }
};

exports.updateOutfit = async (req, res) => {
    try {
        const updatedOutfit = await Outfit.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOutfit) {
            return res.status(404).send("Outfit no encontrado");
        }
        res.status(200).json(updatedOutfit);
    } catch (error) {
        res.status(500).send("Error al actualizar el outfit: " + error.message);
    }
};

exports.deleteOutfit = async (req, res) => {
    try {
        const deletedOutfit = await Outfit.findByIdAndDelete(req.params.id);
        if (!deletedOutfit) {
            return res.status(404).send("Outfit no encontrado");
        }
        res.status(200).send("Outfit eliminado exitosamente");
    } catch (error) {
        res.status(500).send("Error al eliminar el outfit: " + error.message);
    }
};

exports.addClothesToOutfit = async (req, res) => {
    try {
        const { outfitId, clothesId } = req.body;
        const outfit = await Outfit.findById(outfitId);
        const clothes = await Clothes.findById(clothesId);
        if (!outfit || !clothes) {
            return res.status(404).send("Outfit o producto no encontrado");
        }
        outfit.clothes.push(clothes);
        await outfit.save();
        res.status(200).json(outfit);
    } catch (error) {
        res.status(500).send("Error al agregar el producto al outfit: " + error.message);
    }
};

exports.removeClothesFromOutfit = async (req, res) => {
    try {
        const { outfitId, clothesId } = req.body;
        const outfit = await Outfit.findById(outfitId);
        const clothes = await Clothes.findById(clothesId);
        if (!outfit || !clothes) {
            return res.status(404).send("Outfit o producto no encontrado");
        }
        outfit.clothes.pull(clothes);
        await outfit.save();
        res.status(200).json(outfit);
    } catch (error) {
        res.status(500).send("Error al eliminar el producto del outfit: " + error.message);
    }
};

