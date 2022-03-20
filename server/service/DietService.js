const uuid = require('uuid');
const fileType = '.jpg';
const path = require('path');
const { validationResult } = require('express-validator');
const ApiError = require('../error/ApiError');
const Diet = require('../models/Diet');

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
}

module.exports = new DietService();
