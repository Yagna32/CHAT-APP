const express = require('express')
const router = express.Router()

const {
    getAllRooms,
    getChatbyRoom,
    DeleteAllRooms,
    DeleteRoom
    } = require('../controllers/roomExtractor')

router.route('/room/:id')
    .get(getChatbyRoom)
    .delete(DeleteRoom)

router.route('/rooms')
    .get(getAllRooms)
    .delete(DeleteAllRooms)

module.exports = router