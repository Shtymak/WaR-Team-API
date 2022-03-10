const userService = require('../service/UserService')
const ApiError = require("../error/ApiError");
const uuid = require('uuid')
const fileType = '.jpg'
const path = require('path')
const fs = require('fs')

const { validationResult } = require('express-validator');
const User = require('../models/User');
const UserDto = require('../dtos/userDto');


class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Помилка валідації", errors.array()))
            }
            const { email, password, name, role } = req.body;
            const userData = await userService.registration(email, password, role, name);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            return next(ApiError.Forbidden(e.message))
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            res.status(e.status).json(e)
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const token = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            if (token.deletedCount > 0)
                res.status(200).json({ message: "Вихід здійснено успішно", token })
            res.status(404).json({ message: "Ви не авторизовані" })
        } catch (e) {
            res.status(e.status).json(e)
        }
    }

    async getOne(req, res, next) {
        try {

        } catch (e) {

        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect("https://google.com");
        } catch (e) {
            next(e);
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, { maxAge: 7 * 24 * 60 * 60 * 1000, httpOnly: true })
            return res.json(userData);
        } catch (e) {
            res.status(e.status).json(e)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            res.json(users)
        } catch (e) {
            next(ApiError.BadRequest(`Помикла ${e.message}`))
        }
    }


    async update(req, res, next) {
        try {
            const { id } = req.user
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Помилка валідації", errors.array()))
            }
            const { height, weight, gender, dateOfBirth } = req.body
            const { image } = req.files
            const fileName = uuid.v4() + fileType
            image.mv(path.resolve(__dirname, '..', 'static', fileName))
                .then(r => console.log(r))
            const user = await User.findOne({ _id: id })
            if (!user) {
                return next(ApiError.NotFound("Користувача не знайдено!"))
            }
            const result = await User.findByIdAndUpdate({ _id: user._id }, {
                $set: {
                    height: height,
                    weight: weight,
                    gender: gender,
                    dateOfBirth: new Date(dateOfBirth),
                    image: fileName
                }
            });
            res.json({ user: { ...new UserDto(result), image: fileName } });
        } catch (error) {
            next(ApiError.BadRequest(e.message))
        }
    }
}

module.exports = new UserController();
