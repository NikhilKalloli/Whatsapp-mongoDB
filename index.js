require('dotenv').config()


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const myExpressError = require("./MyExpressError.js");

const Chat = require("./models/chat.js");

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname + "/public")));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

const PORT = 3000;

const dbUrl = process.env.ATLAS_DB_URL;


main()
    .then(() => console.log('Connected to Mongo DB.'))
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(dbUrl);
    // await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}



app.get("/", (req, res) => {
    res.redirect("/chats");
});

//Index route
app.get("/chats", async (req, res) => {
    try{
        const chats = await Chat.find();
        // console.log(chats);
        res.render("index.ejs", { chats });
    }catch(err){
        next(err);
    }
});

// New route
app.get("/chats/new", (req, res) => {
    // throw new myExpressError("This is a custom error (Page not found)", 401);
    res.render("new.ejs");
})

//Create route
app.post("/chats", async (req, res, next) => {
    try{

        let { from, to, msg } = req.body;
        let newChat = new Chat({
            from: from,
            to: to,
            msg: msg,
            created_at: new Date()
        })
        // console.log(newChat);
        await newChat.save()
        res.redirect("/chats");
    }catch(err){
        next(err);

    }
})

// We need to execute the return value of asyncWrapper. Return value of asyncWrapper is a function.
function asyncWrapper(fn){
    return function(req,res,next){
        fn(req,res,next).catch((err)=>next(err));
    }
}

// NEW -Show route
app.get("/chats/:id", asyncWrapper(async (req, res,next) => {
        let {id}= req.params;
        let chat = await Chat.findById(id);
        if(!chat){
            return next(new myExpressError("Chat not found",404));
        }
        res.render("edit.ejs",{chat});
}));

//Edit route
app.get("/chats/:id/edit",async (req,res)=>{
    try{
        let {id}= req.params;
        let chat = await Chat.findById(id);
        res.render("edit.ejs",{chat});
    }
    catch(err){
        next(err);
    }
})

//Update route
app.put("/chats/:id",async (req,res)=>{
    try{
        let {id}= req.params;
        let {msg:newMsg} = req.body;
        let updateChat = await Chat.findByIdAndUpdate(id,{msg:newMsg},{runValidators:true, new:true})
        res.redirect("/chats");
    }
    catch(err){
        next(err);
    }

})




//Delete route
app.delete("/chats/:id",async (req,res)=>{
    try{
        let {id} = req.params;
        let deleteChat = await Chat.findByIdAndDelete(id);
        res.redirect("/chats");
    }catch(err){
        next(err);
    }

});

const handleValidationErr = (err) => {
    console.log("This is a validation error");
    console.dir(err.message);
    return err;
}

// 404 error handling middleware
app.use((err,req,res,next)=>{
    console.log(err.name);
    if(err.name === "ValidationError"){
        err = handleValidationErr(err);
    }
    next(err);
})

// Error handling middleware
app.use((err,req,res,next)=>{
    let { status = 500, message = "Something went wrong"} = err;
    res.status(status).send(message);
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});