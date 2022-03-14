module.exports = class recipeDto {
    constructor(model) {
        this._id = model._id;
        this.name = model.name;
        this.description = model.description;
        this.image = model.image;
    }
};
