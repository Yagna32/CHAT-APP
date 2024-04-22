
const path = require('path')
const http = require('http')
const express = require('express')
const mongoose = require('mongoose')
const socketio = require('socket.io')
const Filter = require('bad-words')
const {generateMessage , generateLocation } = require('./utils/messages')
const {addUser, removeUser, getUser, getUserInRoom } = require('./utils/users')
const MakeFile = require('./utils/MakeFile')
const app = express()
const Chat = require('./models/Chats')
const Room = require('./models/Rooms')
const routerchat = require('./routes/Chatroutes')
const routerRoom = require('./routes/Roomroutes')
const server = http.createServer(app)
const io = socketio(server)
port = process.env.PORT || 5000
const publicDirectoryPath = path.join(__dirname , '../public')
const mongoURL = process.env.MONGO_URL || "mongodb://127.0.0.1:27017/Chat-App"
const cors = require('cors')
app.use(cors());

mongoose.connect(mongoURL,
 {
   useNewUrlParser: true,
    useUnifiedTopology: true
    // useCreateIndex: true 
 }
 ).then(()=>{
    console.log("Database is connected!")
    success = true
}).catch((e)=>{
    console.log(`Database connection error : ${e}`)
    console.log('\nError connecting to MongoDB, retrying .....')
})




app.use(express.static(publicDirectoryPath))
app.use('/chat/',routerchat)
app.use('/room/',routerRoom)
io.on('connection',(socket)=>{
    console.log("New Websocket connection...")

    socket.on('join' , (options, callback)=>{
        const {error , user } = addUser({id : socket.id , ...options})

        if(error){
            return callback(error)
        }
        console.log("inside join")
        socket.join(user.room)
        const wellcome = generateMessage('Admin','Welcome!');
        socket.emit('message' ,wellcome)

        const joined = generateMessage('Admin',`${user.username} has joined!`)
        socket.broadcast.to(user.room).emit('message', joined,async(data)=>{
            const chat = new Chat({
                ...joined,
                Room: user.room,
                UsersInRoom : getUserInRoom(user.room)
            });
            chat.save()
            if(getUserInRoom(user.room).length == 1){
            const room = new Room({
                    RoomID : user.room,
                    Chats: {
                            message: joined.text,
                            sender: joined.username,
                            createdAt: joined.createdAt,
                            UsersInRoom: getUserInRoom(user.room)   
                    },
                    createdAt : joined.createdAt,
                    ClosedAt: null
            })
            room.save()
        }
        else {
            const room = await Room.findOneAndUpdate({RoomID: user.room},{
                    $push: {
                        Chats : {
                            message: joined.text,
                            sender: joined.username,
                            createdAt: joined.createdAt,
                            UsersInRoom: getUserInRoom(user.room)
                        }
                    }
            })
            room.save()
        }
        })
        

        // const chat = new Chat({
        //     ...message,
        //     Room: user.room,
        //     UsersInRoom : getUserInRoom(user.room)
        // })

        // chat.save()
        io.to(user.room).emit('roomData' , {
            room : user.room,
            users: getUserInRoom(user.room)
        })
        console.log(`${user.username} has joined! in room ${user.room}`)
        callback()
    })


    socket.on('sendMessage' ,async (message , callback)=>{
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profanity is not allowed!')
        }
        message =  generateMessage(user.username,message)
        const chat = new Chat({
            ...message,
            Room: user.room,
            UsersInRoom : getUserInRoom(user.room)
        })

        chat.save()
        const room = await Room.findOneAndUpdate({RoomID: user.room},{
            $push: {
                Chats : {
                    message: message.text,
                    sender: message.username,
                    createdAt: message.createdAt,
                    UsersInRoom: getUserInRoom(user.room)
                }
            }
    })
    room.save()
        io.to(user.room).emit('message' ,message)
        callback()
    })

    socket.on('sendLocation' , (coords , callback) =>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage' , generateLocation(user.username,`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`))
        callback()
    })

    socket.on('disconnect' , async()=>{
        const user = removeUser(socket.id)

        if(user){
            const leaveMsg = generateMessage('Admin',`${user.username} has left!`)
            io.to(user.room).emit('message' , leaveMsg)
            io.to(user.room).emit('roomData' , {
                room : user.room,
                users: getUserInRoom(user.room)
            })
            if(getUserInRoom(user.room).length >= 1){
                const room = await Room.findOneAndUpdate({RoomID: user.room},{
                    $push: {
                        Chats : {
                            message: leaveMsg.text,
                            sender: leaveMsg.username,
                            createdAt: leaveMsg.createdAt,
                            UsersInRoom: getUserInRoom(user.room)
                        }
                    }
            })
            room.save()
            }
            else {
                const room = await Room.findOneAndUpdate({RoomID: user.room},{
                    $push: {
                        Chats : {
                            message: leaveMsg.text,
                            sender: leaveMsg.username,
                            createdAt: leaveMsg.createdAt,
                            UsersInRoom: getUserInRoom(user.room)
                        }
                    },
                    ClosedAt: leaveMsg.createdAt
            })
            room.save();
            MakeFile(user.room);
            }
        }
        

    })
})

server.listen(port , ()=>{
    console.log(`Server is running on port ${port}`)
})