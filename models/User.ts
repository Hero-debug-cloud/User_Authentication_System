const mongoose = require("mongoose");


const UserSchema = new mongoose.Schema({
    Name: {
        type: String,
        require:true
    },
    username: {
        type: String,
        require:true
    },
    bio: {
        type: String,
        require:true
    },
    age: {
        type: Number,
        require:true
    },
    password: {
        type: String,
        require:true
    },
});

module.exports = mongoose.model("User", UserSchema);
