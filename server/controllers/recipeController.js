const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const fileType = '.jpg';
const path = require('path');
const { validationResult } = require('express-validator');
const Recipe = require('../models/Recipe');
const recipeDto = require('../dtos/recipeDto');

class RecipeController {
    async create(req, res, next) {
        try {
            const { name, description, ingredients } = req.body;
            const { image } = req.files;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Помилка валідації', errors.array())
                );
            }
            const fileName = uuid.v4() + fileType;
            image
                .mv(path.resolve(__dirname, '..', 'static', 'recipe', fileName))
                .then((r) => console.log(r));

            const recipe = await Recipe.create({
                name,
                description,
                image: fileName,
                ingredients: JSON.parse(ingredients),
            });
            res.json(recipe);
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const recipe = await Recipe.findOne({ _id: id });
            res.json(new recipeDto(recipe));
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async update(req, res, next) {}
}

module.exports = new RecipeController();
