const Room = require('../models/Rooms')

exports.getChatbyRoom = async(req,res) =>{
try{
    const room = await Room.findById(req.params.id)
    if(!room) {
        res.status(404).send("No Data Found");
        return ;
    }
    res.status(200).send(room)
}
catch(e) {
    console.log(e);
    res.status(400).send("Bad request");
    return;
}
}

exports.DeleteAllRooms = async(req,res) => {
    try{
        const room = await Room.deleteMany()
        if(!room) {
            res.status(404).send("No Data Found");
            return ;
        }
        res.status(200).send(room)
    }
    catch(e) {
        console.log(e);
        res.status(400).send("Bad request");
        return;
    }
}

exports.DeleteRoom = async(req,res) =>{
    try{
        const room = await Room.findByIdAndDelete(req.params.id)
        if(!room) {
            res.status(404).send("No Data Found");
            return ;
        }
        res.status(200).send(room)
    }
    catch(e) {
        console.log(e);
        res.status(400).send("Bad request");
        return;
    }
}

exports.getAllRooms = async(req,res) => {
    try{
        const room = await Room.find()
        if(!room) {
            res.status(404).send("No Data Found");
            return ;
        }
        res.status(200).send(room)
    }
    catch(e) {
        console.log(e);
        res.status(400).send("Bad request");
        return;
    }
}