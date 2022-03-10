const {Schema, model} = require('mongoose');

const User = new Schema({
        email: {type: String, unique: true, required: true},
        password: {type: String, required: true},
        name: {type: String, required: true, default: ""},
        height: {type: Number, default: 0.0},
        weight: {type: Number, default: 0.0},
        gender: {type: String, default: "Male"},
        dateOfBirth: {type: Date, default: new Date().getDate()},
        image: {type: String, required: false},
        isActivated: {type: Boolean, default: false},
        activationLink: {type: String},
        role: {type: String, default: "USER"},
    }
)

module.exports = model('User', User);
