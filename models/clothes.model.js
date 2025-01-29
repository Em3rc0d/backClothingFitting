const mongoose = require('mongoose');

const clothesSchema = new mongoose.Schema({
  brand: {
    type: String,
    required: true,
    default: 'Unknown',
  },
  image: {
    type: String,  // Guardamos la ruta o URL de la imagen
    required: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Clothes', clothesSchema);
