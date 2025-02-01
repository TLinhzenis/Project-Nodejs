const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
    musicName: { type: String, required: true },
    singer: { type: String, required: true },
    category: { type: String, required: true },
    audio: { type: String, required: true },
    image: { type: String, required: true },
});

const Song = mongoose.model('Song', songSchema);
module.exports = Song;
