import mongoose from "mongoose";
import dotenv from "dotenv";
import { text } from "express";

dotenv.config();

// ✅ Correctly define connectDB function (named export)
export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MongoDB_Connection_String, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("❌ MongoDB Connection Failed:", err.message);
    process.exit(1);
  }
};

// ✅ Define Mongoose schemas properly
const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
    email: { type: String, required: true },
    profilePic: { data: Buffer, contentType: String },
  },
  { timestamps: true }
);

const postSchema = new mongoose.Schema({
  author: { type: String, required: true },
  title: { type: String, required: true },
  content: { type: String, required: true },
  slug: { type: String, required: true },
  like : {type : Number , default : 0},
  comments : [
    {
      author : String,
      text : String,
      authorPic : String // Base64 profile Url 
      // looks like 
      //data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA... (base64 data)
    }
  ]
});

// ✅ Export models
export const userdb = mongoose.model("users", userSchema);
export const postdb = mongoose.model("posts", postSchema);
