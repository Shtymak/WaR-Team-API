module.exports = class dietDto {
    constructor(model) {
        this._id = model._id;
        this.name = model.name;
        this.image = model.image;
    }
};
