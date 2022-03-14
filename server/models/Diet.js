const { Schema, model } = require('mongoose');

const Diet = new Schema({
    name: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    recipes: { type: Schema.Types.Array, default: [] },
});

module.exports = model('Diet', Diet);
