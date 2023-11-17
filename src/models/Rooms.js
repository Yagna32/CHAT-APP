const mongoose = require("mongoose")

const RoomSchema = new mongoose.Schema({
    RoomID: {
        type: String,
        required: true,
    },
    Chats: {
        type: Array,
        Message: {
            type: String,
            required:true
        },
        sender: {
            type: String,
            required: true
        },
        createdAt: {
            type: Number,
            required: true
        },
        UsersInRoom : {
            type: Array
        }
    },
    createdAt: {
        type: Number,
        required: true,
        },
    ClosedAt: {
        type: Number
    }
});

const Room = new mongoose.model('Rooms',RoomSchema)

module.exports = Room