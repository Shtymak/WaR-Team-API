const ApiError = require('../error/ApiError');
const { validationResult } = require('express-validator');
const Diet = require('../models/Diet');
const dietDto = require('../dtos/dietDto');

const dietService = require('../service/DietService');

class DietController {
    async create(req, res, next) {
        try {
            const { name } = req.body;
            const { image } = req.files;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Помилка валідації', errors.array())
                );
            }
            const diet = await dietService.create(name, image);
            res.json(diet);
        } catch (e) {
            next(ApiError.BadRequest(e.message));
        }
    }
    async getOne(req, res, next) {
        try {
            const { id } = req.params;
            const diet = await Diet.findById(id);
            if (!diet) {
                return next(ApiError.NotFound(`Дієти з id:${id} немає`));
            }
            res.json(new dietDto(diet));
        } catch (error) {
            next(ApiError.NotFound(`Дієту з таким id не знайдено`));
        }
    }
    async getAll(req, res, next) {
        try {
            const diets = await dietService.getAll();
            res.json({ diets });
        } catch (error) {
            next(
                ApiError.BadRequest(
                    `Список дієт порожній або сталася помилка ${error.message}`
                )
            );
        }
    }
    async update(req, res, next) {
        try {
            const { id, name } = req.body;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Помилка валідації', errors.array())
                );
            }
            const result = await dietService.update(id, name);
            res.json(new dietDto(result));
        } catch (error) {
            next(ApiError.NotFound(error.message));
        }
    }

    async addRecepie(req, res, next) {
        try {
            const { recepieId, dietId } = req.body;
            const result = await dietService.addRecepie(dietId, recepieId);
            res.json(result);
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async removeRecipe(req, res, next) {
        try {
            const { recipeId, dietId } = req.body;
            const result = await dietService.removeRecipe(dietId, recipeId);
            res.json(result);
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }
    async getRecipes(req, res, next) {
        try {
            const { id } = req.params;
            const recipes = await dietService.getRecipes(id);
            res.json({ recipes });
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async addToFavorite(req, res, next) {
        try {
            const { dietId } = req.body;
            const { id } = req.user;
            const result = await dietService.addToFavorite(dietId, id);
            res.json({ result: result.modifiedCount > 0 ? 'OK' : 'EXIST' });
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async removeFromFavorite(req, res, next) {
        try {
            const { dietId } = req.body;
            const { id } = req.user;
            const result = await dietService.removeFromFavorite(dietId, id);
            res.json({ result: result.modifiedCount > 0 ? 'OK' : 'FAIL' });
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async getFavorites(req, res, next) {
        try {
            const { id } = req.user;
            const favorites = await dietService.getFavorites(id);
            res.json({ diets: favorites.diets });
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }
}

module.exports = new DietController();
