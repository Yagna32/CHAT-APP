const express = require('express')
const router = express.Router()

const {
    getChat,
    getAllChats,
    DeleteChat,
    DeleteAllChats
} = require('../controllers/chatExtractor')

router
    .route('/chat/:id')
    .get(getChat)
    .delete(DeleteChat)
router
    .route('/chats')
    .get(getAllChats)
    .delete(DeleteAllChats)

module.exports = router