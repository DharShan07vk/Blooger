import express from 'express'
import dotenv from 'dotenv'
import multer  from 'multer'
import session  from 'express-session'
import {connectDB ,  postdb , userdb } from './config.js';
import flash from 'connect-flash'
import cors from 'cors'
import path from 'path';
import { fileURLToPath } from 'url';
import favicon from 'serve-favicon'


dotenv.config()
const app = express()
const port = 3000
let loginMsg = ""
app.use(express.urlencoded({ extended: true }))
app.set('view engine', 'ejs')
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('views', path.join(__dirname, 'views'));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//For Vercel Deployment
app.use(express.static(path.join(__dirname , 'public')))
//For Local Deployment or any other like render
//app.use(express.static("public"))
const corsConfig = {
    origin : "*",
    Credential : true,
    methods : ["GET", "POST","PUT","DELETE"]
};

const storage = multer.memoryStorage(); //Directly Storing into Database
  
// Upload Used in post method in the profile/update
//Restrict other files types
const upload = multer({
    storage,
    fileFilter : (req,file,callback) =>{
        const allowed = ['image/jpeg', 'image/png', 'image/jpg'];
        if(allowed.includes(file.mimetype)){
            callback(null,true);
        }
        else{
        
            console.log("Errorrr")
        }
    }
});

connectDB();

app.listen(port, () => {
  console.log("Listening on 3000");
  console.log("http://localhost:3000/");
});


app.use(session({
    secret: process.env.Session_Secret,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, 
        maxAge: 1000 * 60 * 60, // 1 hour
    },
}))


app.use(cors(corsConfig))
app.use(flash())

function getSlug(title){
    return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|&$)/g , "");
}

app.use((req, res, next) => {
  res.locals.username = req.session.username || null;
  next();
});

app.get('/',(req,res)=>{
    res.render("home.ejs")   
})

app.get('/blog',async(req,res)=>{
    try{
        if(req.session.username){
        //Fetching Posts One by One from Database
        const posts = await postdb.find();
        res.render("blogs.ejs", {blog : posts, islogin : true});  
        }  
        else{
            res.render("blogs.ejs", {blog : [] , islogin : false})
        }   
    }
    catch{
        console.error.log("Error.. Check app.get(/blog)")
    }
})

app.get("/create",(req,res)=>{
    if(!req.session.username){
        return res.render('home', {errormsg : "You must be logged in to create posts :)"})
    }
    res.render('create.ejs')
})


app.get("/logout",(req,res)=>{
    req.session.destroy(err =>{
        if(err){
            console.log("Errorrr : " + err)
            return res.redirect('/')
        }
        res.redirect('/')
    })
})

app.get("/login",(req,res)=>{
    res.render("login.ejs", {msg : loginMsg})
    loginMsg = ""
})

app.get("/forgot-password",(req,res)=>{
    res.render("forgot-password.ejs")
})

app.get("/register",(req,res)=>{
    res.render("register")
})

app.get("/about", (req,res)=>{
    res.render("about.ejs")
})

app.get("/contact",(req,res)=>{
    res.render("contact.ejs")
})

app.get("/policy", (req,res)=>{
    res.render("policy.ejs");
})
app.get("/profile", async(req,res)=>{
    try{
    if(req.session.username){
        const user = await userdb.findOne({username : req.session.username})
        const post = await postdb.find({author : req.session.username})
        let profilePic = null;
        if(user.profilePic.data && user.profilePic)
        {
            profilePic = `data:${user.profilePic.contentType};base64,${user.profilePic.data.toString('base64')}`;
        }
        return res.render("profile", {
            user : user , 
            posts : post , 
            profile : profilePic,
            successMessage: req.flash('success')[0],
            errorMessage: req.flash('error')[0]
        })
    }
    res.render("home" , {errormsg : "You must be logged in to access profile Section 🫂🥹"})
    }
    catch{res.render("home" , {errormsg : "Something Went Wrong...." })}
   
})

app.post("/login", async (req,res)=>{
    const {username,email, password} = req.body;
    //Check User Created account or not
    const isuser = await userdb.findOne({email : email})
    if(!isuser){
        res.redirect("/login")
        loginMsg = `Account? Ghosted. Like your ex 👻...
        No Account Found`
    }
    else{
        if(password == isuser.password && username === isuser.username){
        req.session.username = isuser.username;
        console.log(req.session.username)
        res.redirect("/")
        }
        else{
            res.redirect("/login")
            loginMsg = `Login failed.Just like your last situationship💔
            Check Your Login Credentials`
            console.log("Password Wrong")
        }
    }
})

app.post("/register",async (req,res)=>{
    const  { username, email, password, confirm_password } = req.body;
    const ismail = await userdb.findOne({email : email})
    const isuser = await userdb.findOne({username : username})
    if(ismail || isuser){
        return  res.render("register.ejs", {msg : "This email or Username taken... Just like your ex"})
    }
    if(password != confirm_password){
        res.render("register.ejs", {msg : "Passwords don’t match. Make them besties 😤 "})
    }
    else{
        req.session.username = username;
        const userdata = await userdb.insertMany({username,email,password})
        console.log(userdata)
        res.redirect("/")
    }

})
app.post("/post",async(req,res)=>{
    const post = {
        title : req.body.title,
        author : req.session.username,
        content : req.body.content,
        slug  : getSlug(req.body.title)
    }
    const existpost = await postdb.findOne({slug : post.slug})
    //Checking Same title Post already exists
    if(existpost){
        console.log("Post Already Exists with Same Title....")
        return res.render("create.ejs", { msg: "Error: Old feelings, old title. Time to heal with fresh title 📝👻💔" })
    }
    await postdb.insertMany(post);
    res.render("home" , {successmsg : "Post Created SuccessFully 👻"});
})

app.get("/:slug",async(req,res)=>{
    
    const crtSlug = req.params.slug;
    const post = await postdb.findOne({slug : crtSlug});
    if(!post){
        res.render("404.ejs")
    }
    else{
        res.render("post", {post})
    }
})

app.get("/edit/:id", async(req,res)=>{
    try{
    const postId = req.params.id;
    const post = await postdb.findById({_id : postId})
    if(post && req.session.username === post.author){
        return res.render("edit.ejs", {blog  : post})
    }
    else {throw err}
    }
    catch(err){
        res.render("home" , {errormsg : "Something Went Wrong Buddy 😑"})
    }
    
})

app.post("/update/:id", async(req,res)=>{
    try{
        const {title , content} = req.body;
        const newSlug = getSlug(title);
        const post = await postdb.findOne({_id : req.params.id})
        if(post && post.author === req.session.username){
        await postdb.findByIdAndUpdate(req.params.id , {title : title ,  content : content , slug  : newSlug})
        res.render("home",{successmsg : "Blog Updated 👍 "})
        }
        else{ throw err}
    }
    catch(err){
        res.render("home",{errormsg : "Something Went Wrong 🤐"})
    }
})

app.post("/delete/:id", async (req,res)=>{
    const postId = req.params.id;
    const post = await postdb.findById({_id : postId});
    if(req.session.username == post.author){
        await postdb.findByIdAndDelete({_id : postId })
        return res.redirect("/profile");
    }
    res.redirect("/")
})

app.post("/profile/update-picture", upload.single('profilepic'), async (req, res) => {
    try{
        const user =  await userdb.findOne({username:req.session.username})
        if(user && req.session.username){
            user.profilePic = {
                data : req.file.buffer,
                contentType : req.file.mimetype
            }
            await user.save();
            req.flash('success', 'Profile picture updated successfully!');
            res.redirect("/profile")
        }
        else{
            req.flash('error', 'Profile Picture Not Updated')
            return res.redirect("/profile")
        }
    }
    catch{
        res.render("home", {errormsg : "Something Went Wrong In uploading Profile Picture 😭😭"})

    }   
});

app.post("/profile/update-username",async(req,res)=>{
    try{
        if(req.session.username){
            const newname = req.body.newUsername;
            const isexist = await userdb.findOne({username : newname})
            if(!isexist){
                const user = await userdb.findOne({username : req.session.username})
                const oldname = user.username;
                await userdb.findByIdAndUpdate(user._id , {username : newname})
                req.session.username = newname;
                await postdb.updateMany({author : oldname} ,{$set :  {author : newname} })
                req.flash('success', 'Username changed successfully!');
                res.redirect("/profile")
            }
            else{
                req.flash('error' , 'Issue In Updating Username')
                res.redirect('/profile')
            }
        }
        else{
            res.render('home', {errormsg : "Session Expired"})
        }
    }
    catch{
         res.render("home" , {errormsg : "Something Went Wrong Buddy in updating Username 😑"})
    }
})

app.post("/profile/change-password", async (req,res)=>{
    if(req.session.username){
        const {currentPassword , newPassword , confirmPassword} = req.body;
        const user = await userdb.findOne({username : req.session.username})
        if(!user){
            req.flash('error' , 'User Not Found')
            return res.redirect('/profile')
        }
        if(user.password == currentPassword && newPassword===confirmPassword){
            await userdb.updateOne({username:req.session.username}, {password : newPassword})
            req.flash('success', 'Password Updated SuccessFully')
            return res.redirect('/profile')
        }
        else{
            req.flash('error','Check Password or New Password and Confirm Password')
            return res.redirect("/profile")
        }
    }
    else{
        res.render("home", {errormsg : "Maybe Session Expired"})
    }
})


app.get('/test-db', async (req, res) => {
  try {
    const count = await userdb.countDocuments();
    res.send(`✅ MongoDB connected! Found ${count} users.`);
  } catch (err) {
    res.status(500).send('❌ DB Error: ' + err.message);
  }
});


//404 Page Not Found By using middleWare
app.use((req, res) => {
  res.status(404).render('404'); // Assumes 404.ejs is in the "views" folder
});
