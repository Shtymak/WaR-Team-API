const User = require('../models/User')
const ApiError = require("../error/ApiError");
const mailService = require('./MailService')
const tokenService = require('./TokenService')
const bcrypt = require('bcrypt')
const uuid = require('uuid')
const UserDto = require("../dtos/userDto");

class UserService {

    async getTokens(user) {
        const currentUserDto = new UserDto(user)
        const tokens = tokenService.generateTokens({...currentUserDto})
        await tokenService.saveToken(currentUserDto.id, tokens.refreshToken)
        return {
            ...tokens,
            user: currentUserDto
        }
    }

    async registration(email, password) {
        const candidate = await User.findOne({email})
        if (candidate) {
            throw ApiError.BadRequest(`Користувач з логіном ${email} існує!`)
        }
        const hashPassword = await bcrypt.hash(password, 9)
        const activationLink = uuid.v4()
        const user = await User.create({email, password: hashPassword, activationLink})
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/user/activate/${activationLink}`);
        return this.getTokens(user)
    }

    async activate(activationLink) {
        const user = await User.findOne({activationLink})
        if (!user) {
            throw ApiError.BadRequest('некоректне посилання активації')
        }
        user.isActivated = true;
        await user.save();
    }

    async login(email, password) {
        const user = await User.findOne({email})
        if (!user) {
            throw ApiError.NotFound("Такого користувача неіснує")
        }
        const isPasswordsEquals = await bcrypt.compare(password, user.password)
        if (!isPasswordsEquals) {
            throw ApiError.BadRequest("Хибний пароль")
        }
        return this.getTokens(user)
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken)
        return token
    }

    async refresh(refreshToken) {
        if (refreshToken) {
            throw ApiError.UnauthorizedError()
        }
        const userData = tokenService.validateRefreshToken(refreshToken)
        const tokenFromDataBase = await tokenService.findToken(refreshToken)
        if (!userData || !tokenFromDataBase) {
            throw ApiError.UnauthorizedError()
        }
        const user = await User.findById(userData.id)
        return this.getTokens(user)
    }
}

module.exports = new UserService();
