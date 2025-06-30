import mongoose  from "mongoose";
import dotenv from "dotenv";

dotenv.config();
const database = mongoose.connect(process.env.MongoDB_Connection_String)
// Check 
database.then(()=>{
    console.log("Database Connected")
}).catch((err)=>{
    console.log("Error " + err.message)
})

//Login Schema
const userdata = new mongoose.Schema({
    username : {type : String , required : true},
    password : {type : String , required : true},
    email : {type : String , required : true},
    profilePic : {data : Buffer , contentType : String} 
},{timestamps : true})




const postdata = {
    author : {type : String , required : true},
    title : {type : String, required : true},
    content : {type : String , required : true},
    slug : {type : String , required : true},
}

export const postdb = mongoose.model("posts",postdata)
export const userdb = mongoose.model("users",userdata)
