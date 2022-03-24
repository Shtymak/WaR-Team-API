const ApiError = require('../error/ApiError');
const uuid = require('uuid');
const fileType = '.jpg';
const path = require('path');
const Recipe = require('../models/Recipe');
const recipeDto = require('../dtos/recipeDto');
const Diet = require("../models/Diet");
const { Types } = require('mongoose');

class RecipeService {
    async create(name, description, ingredients, image){
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
        return recipe;
    }

    async update(id, name){
        if(!Types.ObjectId.isValid(id)){
            throw ApiError.Internal('Невірний id рецепту')
        }
        const result = await Recipe.findOneAndUpdate(
            { _id: id },
            {
                $set: {
                    name: name,
                },
            }
        );
        return result;
    }
}

module.exports = new RecipeService();