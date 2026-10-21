import dotenv from 'dotenv'
import express, { json } from 'express'
import cors from 'cors'
import { connectDB } from './db/index.js';
import { User } from './models/user.js';
import generateToken from './utils/generateToken.js';
import cookieParser from 'cookie-parser'
import jwt from 'jsonwebtoken'
import multer from 'multer'
import { Post } from './models/post.js';
import bcrypt from 'bcrypt'

const upload = multer();

dotenv.config({
    path : ".env"
});

const app = express();

app.use(cors({
    origin : process.env.CLIENT_URL,
    credentials : true
}))

app.use(express.json());
app.use(cookieParser());
app.use(upload.none());


// register -> post
app.post("/register", async(req, res)=>{
    const {name, password} = req.body;

    const user = await User.create({
        name,
        password
    });

    if(user){
        res.status(201).json({
            _id : user._id,
            name : user.name
        });
    }else{
        res.status(400).json({message : "Something went wrong"});
    }
});

// login -> post
app.post("/login", async(req,res)=>{
    const {name, password} = req.body;

    const user = await User.findOne({name});

    if(user && (await user.matchPassword(password))){
        generateToken(res,user._id);
        res.status(200).json({
            _id : user._id,
            name : user.name
        })
    }else{
        res.status(400).json("Invalid Credentials");
    }

});

// profile -> get
app.get("/profile", async(req,res)=>{
    const {token} = req.cookies;

    if (!token) {
        return res.status(401).json({ message: "Not Authorized, No Token" });
    }

    const decoded = jwt.verify(token,process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if(!user){
        res.status(404).json({message : "User not found"});
    }

    res.status(200).json(user);
});

// profile update -> put
app.put("/profile", async(req,res)=>{
    try {
        const {token} = req.cookies;

        if (!token) {
            return res.status(401).json({ message: "Not Authorized, No Token" });
        }

        const decoded = jwt.verify(token,process.env.JWT_SECRET);

        const user = await User.findById(decoded.userId).select("-password");

        if(!user){
            res.status(404).json({message : "User not found"});
        }

        const {name, password} = req.body;

        if(typeof name === "string" && name.trim()){
            user.name = name.trim();
        }

        if(typeof password === "string" && password.trim()){
            user.password = await bcrypt.hash(password, 10);
        }

        await user.save();
        res.status(200).json(user);

    } catch (error) {
        res.status(500).json(error);
    }


});

// logout -> delete
app.delete("/logout", (req,res)=>{
    res.cookie("token", "").json("User Logout Successfully!");
});

// create post -> post
app.post("/upload", async(req,res)=>{
    const {token} = req.cookies;

    if(token){
        const info = jwt.verify(token, process.env.JWT_SECRET);

        if(!info){
           res.status(401).json("User is not authorized!"); 
        }
        const {title, imageUrl, content} = req.body;
        const postCreate = await Post.create({
            title,
            imageUrl,
            content,
            author : info.userId
        });
        
        res.status(200).json({ message: "Post created successfully!" });
    }else{
        res.status(401).json("User is not authorized!");
    }
});

// read all -> get
app.get("/posts", async(req,res)=>{
    const posts = await Post.find().populate("author",["name"]).sort({createdAt : -1});
    res.status(200).json(posts);
});

// read single -> get
app.get("/details/:id", async(req,res)=>{
    const {id} = req.params;

    const post = await Post.findById(id).populate("author", ["name"]);
    res.status(200).json(post);
});

// update old post -> get
app.get("/edit/:id", async(req,res)=>{
    const {id} = req.params;

    const post = await Post.findById(id);
    res.status(200).json(post);
});

// update new post -> put
app.put("/edit", async(req,res)=>{
    const {token} = req.cookies;

    if(token){
        const info = jwt.verify(token, process.env.JWT_SECRET);

        if(!info){
           res.status(401).json("User is not authorized!"); 
        }

        const {title, imageUrl, content, post__id, author_id} = req.body;        
        const updatePost = await Post.findById(post__id);

        if(author_id === info.userId){
            updatePost.title = title;
            updatePost.imageUrl = imageUrl;
            updatePost.content = content;
            updatePost.save();
        }
        return res.status(200).json(updatePost);
    }else{
        res.status(401).json("User is not authorized!");
    }
});

// post delete -> delete
app.delete("/delete/:id", async(req,res)=>{
    const {token} = req.cookies;

    if(token){
        const info = jwt.verify(token, process.env.JWT_SECRET);

        if(!info){
           res.status(401).json("User is not authorized!"); 
        }

        const {id} = req.params;
        const {author_id} = req.body;

        if(author_id === info.userId){
            await Post.findByIdAndDelete(id);
        }
        res.status(200).json("Post delete Successful!");

    }else{
        res.status(401).json("User is not authorized!");
    }
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, ()=>{
    connectDB();
    console.log(`Server is running on PORT : ${PORT}`);
})