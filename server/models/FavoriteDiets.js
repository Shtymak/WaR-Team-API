const { Schema, model } = require('mongoose');

const FavoriteDiets = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    diets: { type: Schema.Types.Array, default: [] },
});
module.exports = model('FavoriteDiets', FavoriteDiets);
