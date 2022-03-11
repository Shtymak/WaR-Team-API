const ApiError = require("../error/ApiError");
const uuid = require('uuid')
const fileType = '.jpg'
const path = require('path')
const { validationResult } = require('express-validator');
const Diet = require("../models/Diet");
class DietController {

    async create(req, res, next) {
        try {
            const { name} = req.body
            const {image} = req.files
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Помилка валідації", errors.array()))
            }
            const fileName = uuid.v4() + fileType
            image.mv(path.resolve(__dirname, '..', 'static', 'diet', fileName))
            .then(r => console.log(r))
            const diet = await Diet.create({ name, image: fileName })
            res.json(diet)
        } catch (e) {
            next(ApiError.BadRequest(e.message))
        }
    }
    async getOne(req, res, next) {
        try {
            const {id} = req.params
            const diet = await Diet.findById(id)
            if(!diet){
                return next(ApiError.NotFound(`Дієти з id:${id} немає`))
            }
            res.json(diet)
        } catch (error) {
           next(ApiError.NotFound(`Дієту з таким id не знайдено`))
        }
    }
    async getAll(req, res, next) {
        try {
            const diets = await Diet.find()
            res.json(diets)
        } catch (error) {
            next(ApiError.BadRequest(`Список дієт порожній або сталася помилка ${error.message}`))
        }
    }
    async update(req, res, next) {
        try{
        const {id, name}  = req.body
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return next(ApiError.BadRequest("Помилка валідації", errors.array()))
        }
        const result = await Diet.findOneAndUpdate({_id: id},{
            $set:{
                name: name
            }
        })
        res.json(result)
        }catch(error){
            next(ApiError.NotFound(error.message))
        }
    }

}

module.exports = new DietController()