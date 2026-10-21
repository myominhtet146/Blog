import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

const PostForm = ({ Title, Btntext, isEditMode }) => {
  const [title, setTitle] = useState("");   
  const [imageUrl, setImageUrl] = useState("");
  const [content, setContent] = useState("");
  const [editPostId, setEditPostId] = useState("");
  const [authorId, setAuthorId] = useState("");

  const navigate = useNavigate();
  const params = useParams();

  const getOldData = async()=>{
    const response = await fetch(`${import.meta.env.VITE_URL}/edit/${params.id}`);
    const data = await response.json();
    
    const {title, imageUrl, content, _id, author} = data;
    setTitle(title);
    setImageUrl(imageUrl);
    setContent(content);
    setEditPostId(_id);
    setAuthorId(author);
  }

  useEffect(()=>{
    if(isEditMode){
      getOldData();
    }
  }, []);
  
  const createPost = async(e)=>{
    e.preventDefault();
    if(!title.trim()) return;
    if(!imageUrl.trim()) return;
    if(!content.trim()) return;

    const formData = new FormData();
    formData.append("title", title);
    formData.append("imageUrl", imageUrl);
    formData.append("content", content);
    formData.append("post__id", editPostId);
    formData.append("author_id", authorId);

    let fetchUrl = `${import.meta.env.VITE_URL}/upload`;
    let method = "post"

    if(isEditMode){
      fetchUrl = `${import.meta.env.VITE_URL}/edit`;
      method = "put"
    }

    const response = await fetch(fetchUrl,{
      method,
      body : formData,
      credentials : "include"
    });

    if(response.ok && isEditMode){
      toast.success("Post Update Successful!");
      navigate("/");
    }else if(response.ok){
      toast.success("Post Create Successful!");
      navigate("/");
    }else{
      toast.error("Something went wrong");
    }
  }

  return (
    <div className="min-h-72 my-20">
      <div className="w-full font-serif max-w-md mx-auto shadow-xl border border-slate-100 p-8 space-y-6 rounded-xl">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">{Title}</h2>
        </div>

        <form onSubmit={createPost} method="post">
          <div>
            <label className="text-slate-700 text-sm font-semibold">
              Post title
            </label>
            <input
              type="text"
              name="title"
              placeholder="Enter post title"
              className="form focus:outline-none bg-slate-50/50"
              value={title}
              onChange={(e)=>setTitle(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-slate-700 text-sm font-semibold">
              Upload cover photo url
            </label>
            <input
              type="text"
              name="image"
              placeholder="Enter post title"
              className="form focus:outline-none bg-slate-50/50"
              value={imageUrl}
              onChange={(e)=>setImageUrl(e.target.value)}
            />
          </div>

          <div>
            <label className="text-slate-700 text-sm font-semibold">
              Description
            </label>
            <textarea
              className="form focus:outline-none bg-slate-50/50 h-20"
              placeholder="Enter post description"
              name="content"
              value={content}
              onChange={(e)=>setContent(e.target.value)}
            ></textarea>
          </div>

          <button className="text-white bg-black p-2.5 w-full text-center rounded-3xl cursor-pointer my-4 hover:bg-slate-900 transition">
            {Btntext}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostForm;
