const mongoose = require("mongoose");

const imageSchema = new mongoose.Schema({
    filename: String,
    filepath: String,
    Phytochemicals: String,
    Molecularweight: { type: Number, default: null },
    NHD: { type: Number, default: null },
    NHA: { type: Number, default: null },
    LogP: { type: Number, default: null },
    NRB: { type: Number, default: null },
    Electrophilicity: { type: Number, default: null },
    uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Image", imageSchema);
