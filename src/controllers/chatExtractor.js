const Chat = require('../models/Chats')

exports.getChat = async(req,res) =>{
    try{
        const chats = await Chat.findById(req.params.id);
        if(chats){
            res.status(200).send(chats);
        }
        else {
            res.status(404).send("No Data Found")
        }
        }
        catch(e) {
            console.log(e);
            res.status(400).send("Bad request");
        }
        
        
}

exports.DeleteAllChats = async(req,res) => {
    try{
        const chats = await Chat.deleteMany();
        if(chats){
            res.status(200).send(chats);
        }
        else {
            res.status(404).send("No Data Found")
        }
        }
        catch(e) {
            console.log(e);
            res.status(400).send("Bad request");
            return ;
        }
        
}

exports.DeleteChat = async(req,res) =>{
    try{
        const chats = await Chat.findByIdAndDelete(req.params.id);
        if(chats){
            res.status(200).send(chats);
            return;
        }
        else {
            res.status(404).send("No Data Found")
        }
        }
        catch(e) {
            console.log(e);
            res.status(400).send("Bad request");
            return ;
        }
        
}

exports.getAllChats = async(req,res) => {
    try{
    const chats = await Chat.find();
    if(chats){
        res.status(200).send(chats);
        return;
    }
    else {
        res.status(404).send("No Data Found")
    }
    }
    catch(e) {
        console.log(e);
        res.status(400).send("Bad request");
        return ;
    }
    
}