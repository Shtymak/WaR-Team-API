module.exports = class UserDto{
    email;
    id;
    isActivated;
    constructor(model) {
        this.email = model.email
        this.id = model._id
        this.name = model.name
        this.isActivated = model.isActivated
        this.role = model.role
        this.height = model.height
        this.weight = model.weight
        this.gender = model.gender
        this.dateOfBirth = model.dateOfBirth
    }
}
