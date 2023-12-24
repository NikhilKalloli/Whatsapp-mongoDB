const mongoose = require("mongoose");
const Chat = require("./models/chat");
require('dotenv').config()



const dbUrl = process.env.ATLAS_DB_URL;

main()
.then(() => {
    console.log('Connected to Mongo DB.');
    console.log('Database initialized')
})
.catch((err) => console.log(err));

async function main() {
  await mongoose.connect(dbUrl);
//   await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

let allChats=[
    {
        from:"Jhon",
        to:"Alice",
        msg:"Hi Alice",
        created_at:new Date() 
    },
    {
        from:"Nikhil",
        to:"Harry",
        msg:"Hi Harry",
        created_at:new Date() 
    },
    {
        from:"Lisa",
        to:"peter",
        msg:"Hi peter",
        created_at:new Date() 
    },
    {
        from:"nick",
        to:"jessica",
        msg:"Hi jessica",
        created_at:new Date() 
    },
    {
        from:"jimmy",
        to:"chris",
        msg:"Hi chris",
        created_at:new Date() 
    },

]

Chat.insertMany(allChats);