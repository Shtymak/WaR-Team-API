class ApiError extends Error {
    constructor(status, message) {
        super();
        this.status = status
        this.message = message
    }

    static BadRequest(message, errors = []) {
        return new ApiError(404, {message, errors})
    }

    static Internal(message) {
        return new ApiError(500, message)
    }

    static Forbidden(message) {
        return new ApiError(403, message)
    }

    static NotFound(message){
        return new ApiError(404, message)
    }

    static UnauthorizedError(message = "Ви неавторизовані"){
        return new ApiError(401, message)
    }
}


module.exports = ApiError
