const uuid = require('uuid');
const fileType = '.jpg';
const path = require('path');
const { validationResult } = require('express-validator');
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
        try {
            const fileName = uuid.v4() + fileType;
            image
                .mv(path.resolve(__dirname, '..', 'static', 'diet', fileName))
                .then((r) => console.log(r));
            const diet = await Diet.create({
                name,
                image: fileName,
            });
            return diet;
        } catch (error) {
            throw ApiError.Internal(error.message);
        }
    }
    async getAll() {
        try {
            const diets = await Diet.find();
            const dietDtos = diets.map((diet) => new dietDto(diet));
            return dietDtos;
        } catch (error) {
            throw ApiError.Internal(error.message);
        }
    }
    async update(id, name) {
        try {
            const result = await Diet.findOneAndUpdate(
                { _id: id },
                {
                    $set: {
                        name: name,
                    },
                }
            );
            return result;
        } catch (error) {
            throw ApiError.Internal(error.message);
        }
    }

    async addRecipe(dietId, recepieId) {
        try {
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
        } catch (error) {
            throw ApiError.Internal(error.message);
        }
    }
    async removeRecipe(dietId, recepieId) {
        try {
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
        } catch (error) {
            throw ApiError.Internal(error.message);
        }
    }
}

module.exports = new DietService();
