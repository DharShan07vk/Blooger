import mongoose  from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const database = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed", err.message);
    process.exit(1); // stop app if DB connection fails
  }
};

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
