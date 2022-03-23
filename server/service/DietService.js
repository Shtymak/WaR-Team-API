const uuid = require('uuid');
const fileType = '.jpg';
const path = require('path');
const ApiError = require('../error/ApiError');
const Diet = require('../models/Diet');
const Recipe = require('../models/Recipe');
const recipeDto = require('../dtos/recipeDto');
const dietDto = require('../dtos/dietDto');
const FavoriteDiets = require('../models/FavoriteDiets');
const { Types } = require('mongoose');

function isValidDietAndRecipeIds(dietId, recepieId = null) {
    if (!Types.ObjectId.isValid(dietId)) {
        return false;
    }
    if (!Types.ObjectId.isValid(recepieId) && recepieId) {
        return false;
    }
    return true;
}

class DietService {
    async create(name, image) {
        const fileName = uuid.v4() + fileType;
        image
            .mv(path.resolve(__dirname, '..', 'static', 'diet', fileName))
            .then((r) => console.log(r));
        const diet = await Diet.create({
            name,
            image: fileName,
        });
        return diet;
    }
    async getAll() {
        const diets = await Diet.find();
        const dietDtos = diets.map((diet) => new dietDto(diet));
        return dietDtos;
    }
    async update(id, name) {
        const result = await Diet.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name: name,
                },
            }
        );
        return result;
    }

    async addRecipe(dietId, recepieId) {
        if (!isValidDietAndRecipeIds(dietId, recepieId)) {
            throw ApiError.Internal('Некоректний id параметр');
        }
        const result = await Diet.updateOne(
            { _id: dietId },
            {
                $addToSet: {
                    recipes: Types.ObjectId(recepieId),
                },
            }
        );
        return result;
    }
    async removeRecipe(dietId, recepieId) {
        if (!isValidDietAndRecipeIds(dietId, recepieId)) {
            throw ApiError.Internal('Некоректний id параметр');
        }
        const result = await Diet.deleteOne(
            { _id: dietId },
            {
                $pull: {
                    recipes: Types.ObjectId(recepieId),
                },
            }
        );
        return result;
    }

    async getRecipes(id) {
        const diet = await Diet.findById(id);
        if (!diet) {
            throw ApiError.NotFound(`Дієти з id:${id} немає`);
        }
        const recipes = await Recipe.find({
            _id: {
                $in: diet.recipes,
            },
        });
        const recipesDto = recipes.map((recipe) => new recipeDto(recipe));
        return recipesDto;
    }
    async addToFavorite(dietId, id) {
        if (!Types.ObjectId.isValid(dietId)) {
            throw ApiError.Internal('Некоректне id дієти');
        }
        const result = await FavoriteDiets.updateOne(
            {
                user: id,
            },
            {
                $addToSet: {
                    diets: Types.ObjectId(dietId),
                },
            }
        );
        return result;
    }
    async removeFromFavorite(dietId, id) {
        if (!isValidDietAndRecipeIds(dietId)) {
            throw ApiError.Internal('Некоректний id параметр');
        }
        const result = await FavoriteDiets.updateOne(
            {
                user: id,
            },
            {
                $pull: {
                    diets: Types.ObjectId(dietId),
                },
            }
        );
        return result;
    }

    async getFavorites(id) {
        const favorites = await FavoriteDiets.findOne({ user: id });
        if (!favorites) {
            throw ApiError.NotFound(
                'Помилка! Цей користувач не обирав улюблені дієти'
            );
        }
        return favorites;
    }
}

module.exports = new DietService();
