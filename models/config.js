const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    age: {
        type: Number,
    },
    place: {
        type: String,
    },
    phone: {
        type: Number,
    },
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    cPassword: {
        type: String,
    },
    isAdmin: {
        type: Number
    }
});

const User = mongoose.model('users', userSchema);
module.exports = User;