import { useEffect } from "react";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Profile = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    // get profile
    const getProfile = async()=>{
        try {
           const response = await fetch(`${import.meta.env.VITE_URL}/profile`,{
                method : "get",
                credentials : "include"
            });

            const data = await response.json();

            if(!response.ok){
                toast.error("Please login first");
                return
            }

            setName(data.name);

        } catch (error) {
            toast.error(error)
        }
    }

    useEffect(()=>{
        getProfile();
    },[]);


    // update profile
    const submitHandler = async(e)=>{
        e.preventDefault();
        if(!name.trim()){
            toast.error("Name is required");
            return
        }

        try {
            const updateData = {name : name.trim()}

            if(password.trim()){
                updateData.password = password
            }

            const response = await fetch(`${import.meta.env.VITE_URL}/profile`,{
                method : "put",
                credentials : "include",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : JSON.stringify(updateData) 
            });

            const data = await response.json();

            if(response.ok){
                toast.success("Profile Update Successful!");
                setPassword("");
                navigate("/");
            }else{
                toast.error("Profile Update Failed!")
            }
        } catch (error) {
            toast.error(error);
        }
    }

  return (
    <div className="min-h-72 my-20">
      <div className="w-full font-serif max-w-md mx-auto shadow-xl border border-slate-100 p-8 space-y-6 rounded-xl">

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, Profile</h2>
          <p className="text-sm text-slate-500">Enter your details to update here!</p>
        </div>

        <form method="post" onSubmit={submitHandler}>
          <div>
            <label className="text-slate-700 text-sm font-semibold">Name</label>
            <input 
                type="text" 
                placeholder="Enter your name" 
                className="form focus:outline-none bg-slate-50/50"
                value={name}
                onChange={(e)=>setName(e.target.value)}
            />
          </div>

          <div>
            <label className="text-slate-700 text-sm font-semibold">Password</label>
            <input 
                type="text" 
                placeholder="Enter your password" 
                className="form focus:outline-none bg-slate-50/50"
                value={password}
                onChange={(e)=>setPassword(e.target.value)}
            />
          </div>

          <button className="text-white bg-black p-2.5 w-full text-center rounded-3xl cursor-pointer my-4 hover:bg-slate-900 transition">Update Profile</button>

        </form>
      </div>
    </div>
  )
}

export default Profile