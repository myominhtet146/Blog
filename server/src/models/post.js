import mongoose, { Schema } from "mongoose";

const postSchema = new Schema({
    title : {
        type : String,
        require : true
    },
    imageUrl : {
        type : String,
        require : true
    },
    content : {
        type : String,
        require : true
    },
    author : {
        type : Schema.Types.ObjectId,
        ref : "User"
    }
},{
    timestamps : true
});

export const Post = mongoose.model("Post", postSchema);