const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const fileType = '.jpg';
const path = require('path');
const { validationResult } = require('express-validator');
const Ingredient = require('../models/Ingredient');

class IngredientController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Помилка валідації', errors.array())
                );
            }
            const ingredient = await Ingredient.create({ name });
            res.json(ingredient);
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }
}

module.exports = new IngredientController();
