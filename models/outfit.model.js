const mongoose = require('mongoose');

const outfitSchema = new mongoose.Schema({
    clothes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Clothes'
    }],
    description: {
        type: String,
        required: true
    },
}, {
    timestamps: true,
});

module.exports = mongoose.model('Outfit', outfitSchema);