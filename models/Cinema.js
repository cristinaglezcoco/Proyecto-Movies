const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const cinemaSchema = new Schema(
    {
        name: {type: String, required: true},
        location: {type: String, required: true},
        movies: [{ type: mongoose.Types.ObjectId, ref: 'Movie' }],
        picture: {type: String}
    },
    {
        timestamps: true
    }
);

const Cinema = mongoose.model('Cinema', cinemaSchema);
module.exports = Cinema;