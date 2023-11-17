const mongoose = require("mongoose")

const ChatSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2
    },
    text: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Number,
        required: true,
        },
    Room: {
        type: Number,
        required:  true
    },
    UsersInRoom : {
        type: Array
    }
    
});

const Chat = new mongoose.model('chat',ChatSchema)

module.exports = Chat