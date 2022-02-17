const ApiError = require("../error/ApiError");
const tokenService = require('../service/TokenService')

module.exports = function (role) {
    return function (req, res, next) {
        if (req.method === 'OPTIONS') {
            next()
        }
        try {
            const token = req.headers.authorization.split(' ')[1]
            if (!token) {
                return next(ApiError.UnauthorizedError())
            }
            const userData = tokenService.validateAccessToken(token)
            if (userData.role !== role) {
                return next(ApiError.Forbidden("Нема доступу! Кіберполіція в дорозі!"))
            }
            req.user = userData
            next()
        } catch (e) {
            return next(ApiError.UnauthorizedError())
        }

    }
}
