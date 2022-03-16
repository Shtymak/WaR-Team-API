const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const fileType = '.jpg';
const path = require('path');
const { validationResult } = require('express-validator');
const Diet = require('../models/Diet');
const Recipe = require('../models/Recipe');
const recipeDto = require('../dtos/recipeDto');
const dietDto = require('../dtos/dietDto');
const FavoriteDiets = require('../models/FavoriteDiets');
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
            const fileName = uuid.v4() + fileType;
            image
                .mv(path.resolve(__dirname, '..', 'static', 'diet', fileName))
                .then((r) => console.log(r));
            const diet = await Diet.create({
                name,
                image: fileName,
            });
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
            const diets = await Diet.find();
            const dietDtos = diets.map((diet) => new dietDto(diet));
            res.json({ diets: dietDtos });
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
            const result = await Diet.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        name: name,
                    },
                }
            );
            res.json(new dietDto(result));
        } catch (error) {
            next(ApiError.NotFound(error.message));
        }
    }

    async addRecepie(req, res, next) {
        try {
            const { recepieId, dietId } = req.body;
            const recipe = await Recipe.findById(recepieId);
            const result = await Diet.updateOne(
                { _id: dietId },
                {
                    $addToSet: {
                        recipes: recipe._id,
                    },
                }
            );
            res.json(result);
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async getRecipes(req, res, next) {
        try {
            const { id } = req.params;
            const diet = await Diet.findById(id);
            if (!diet) {
                return next(ApiError.NotFound(`Дієти з id:${id} немає`));
            }
            const recipes = await Recipe.find({
                _id: {
                    $in: diet.recipes,
                },
            });
            const recipesDto = recipes.map((recipe) => new recipeDto(recipe));
            res.json({ recipes: recipesDto });
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async addToFavorite(req, res, next) {
        try {
            const { dietId } = req.body;
            const { id } = req.user;

            const result = await FavoriteDiets.updateOne(
                {
                    user: id,
                },
                {
                    $addToSet: {
                        diets: dietId,
                    },
                }
            );
            res.json(result);
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async removeFromFavorite(req, res, next) {
        try {
            const { dietId } = req.body;
            const { id } = req.user;
            const diet = await Diet.findById(dietId);
            if (!diet) {
                return next(ApiError.NotFound(`Дієти з id:${dietId} немає!`));
            }
            const result = await FavoriteDiets.findOneAndUpdate(
                {
                    user: id,
                },
                {
                    $pull: {
                        diets: diet._id,
                    },
                }
            );
            res.json(result);
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }

    async getFavotites(req, res, next) {
        try {
            const { id } = req.user;
            const favorites = await FavoriteDiets.findOne({ user: id });
            if (!favorites) {
                return next(
                    ApiError.NotFound(
                        'Помилка! Цей користувач не обирав улюблені дієти'
                    )
                );
            }
            res.json({ diets: favorites.diets });
        } catch (error) {
            next(ApiError.Internal(error.message));
        }
    }
}

module.exports = new DietController();
