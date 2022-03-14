const { Schema, model } = require('mongoose');

const Recipe = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    ingredients: { type: Schema.Types.Array, default: [] },
});

module.exports = model('Recipe', Recipe);
