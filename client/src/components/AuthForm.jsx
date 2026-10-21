import { useContext } from "react";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom"
import { toast } from "react-toastify";
import { UserContext } from "../UserContext";

const AuthForm = () => {
    const [serachParams] = useSearchParams();
    const isLoginMode = serachParams.get("mode") === "login";
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const {setUserInfo} = useContext(UserContext);

    // register
    const register = async()=>{
        const response = await fetch(`${import.meta.env.VITE_URL}/register`,{
            method : "post",
            body : JSON.stringify({name, password}),
            headers : {
                "Content-Type" : "application/json"
            }
        });

        if(response.ok){
          toast.success("Registration Successful!");
          navigate("/auth?mode=login")
        }else{
          toast.error("Registration Failed!");
        }
    }

    // login
    const login = async()=>{
      const response = await fetch(`${import.meta.env.VITE_URL}/login`, {
        method : "post",
        body : JSON.stringify({name, password}),
        headers : {
          "Content-Type" : "application/json"
        },
        credentials : "include"
      });


      if(response.ok){
        const userData = await response.json();
        setUserInfo(userData);
        toast.success("Login Successful!");
        navigate("/");
      }else{
          toast.error("Login failed!");
        }
    }

    // form submit
    const submitHandler = (e)=>{
        e.preventDefault();
        if(!name.trim()) return;
        if(!password.trim()) return;

        if(isLoginMode){
            login();
            setName("");
            setPassword("");
        }else{
            register();
            setName("");
            setPassword("");
          }
    }

  return (
    <div className="min-h-72 my-20">
      <div className="w-full font-serif max-w-md mx-auto shadow-xl border border-slate-100 p-8 space-y-6 rounded-xl">

        <div className="text-center space-y-2">
          <h2 className="text-3xl font-bold text-slate-900">Welcome back, {isLoginMode ? "Login" : "Register"}</h2>
          <p className="text-sm text-slate-500">Please enter your details to {isLoginMode ? "login" : "register"}!</p>
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

          <button className="text-white bg-black p-2.5 w-full text-center rounded-3xl cursor-pointer my-4 hover:bg-slate-900 transition">{isLoginMode ? "Login Account" : "Register Account"}</button>

        </form>
      </div>
    </div>
  )
}

export default AuthForm