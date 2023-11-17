const Room = require('../models/Rooms')
const fs = require('fs')
const MakeFile = async(RoomID) => {
    const room = await Room.findOne({RoomID}).exec()
    let date = new Date(room.createdAt)
    date = date.toString()
    let close  = new Date(room.ClosedAt)
    close = close.toString()
    fs.appendFileSync(`${__dirname.slice(0,-5)}\\Files\\Room${room.RoomID}.txt`,`Created : ${date}`,(err)=>{
        if(err) {
            console.log(err)
        }
    })
    const chats = room.Chats;
    for (var j = 0; j < chats.length; j++){
        let usersInRoom = "No One"
        if(chats[j].UsersInRoom.length > 0){
        usersInRoom = `${chats[j].UsersInRoom[0].username}`
        for(var i = 1;i< chats[j].UsersInRoom.length;i++){
            usersInRoom = usersInRoom.concat(", ",chats[j].UsersInRoom[i].username)
        }
        }
        var time = new Date(chats[j].createdAt)
        time = time.toString()
        fs.appendFileSync(`${__dirname.slice(0,-5)}\\Files\\Room${room.RoomID}.txt`,`\n${chats[j].sender}: \"${chats[j].message}\" \nTime : ${time.slice(0,-32)} Users in Room : ${usersInRoom}\n`,(err)=>{
            if(err) {
                console.log(err)
            }
        })
        }
        fs.appendFileSync(`${__dirname.slice(0,-5)}\\Files\\Room${room.RoomID}.txt`,`\n\nClosed : ${close}`,(err)=>{
            if(err) {
                console.log(err)
            }
        })
}

module.exports = MakeFile