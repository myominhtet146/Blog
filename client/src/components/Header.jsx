import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../UserContext";
import { toast } from "react-toastify";

const Header = () => {
  const { userInfo, setUserInfo } = useContext(UserContext);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const getUserData = async () => {
    try {
        const response = await fetch(`${import.meta.env.VITE_URL}/profile`, {
        credentials: "include",
      });

      const userData = await response.json();

      if(response.ok && userData){
        setUserInfo(userData)
      }else{
        setUserInfo(null);
      }
    } catch (error) {
      console.error("Profile error" , error);
      setUserInfo(null);
    }    
  };

  useEffect(() => {
    getUserData();
  }, []);

  const logout = async () => {
    await fetch(`${import.meta.env.VITE_URL}/logout`, {
      credentials: "include",
      method: "delete",
    });
    setUserInfo(null);
    navigate("/");
    toast.success("Logout Successful!");
  };

  return (
    <nav className="max-w-7xl mx-auto flex items-center justify-between my-10 font-serif">
      <Link
        to={"/"}
        className="text-3xl font-bold text-slate-900 hover:opacity-80"
      >
        Blog
      </Link>
      <div className="flex gap-4">
        {userInfo ? (
          <div className="relative">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center gap-2 font-medium px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-800 transition-colors cursor-pointer"
            >
              <span className="font-medium">{userInfo.name}</span>
              <svg
                className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            {isOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                <Link
                  to={"/post-create"}
                  onClick={() => setIsOpen(false)} // နှိပ်လိုက်ရင် Dropdown ပြန်ပိတ်သွားရန်
                  className="block px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Create Post
                </Link>
                <Link
                  to={"/profile"}
                  onClick={() => setIsOpen(false)} // နှိပ်လိုက်ရင် Dropdown ပြန်ပိတ်သွားရန်
                  className="block px-4 py-2.5 font-medium text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  Profile
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2.5 font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to={"/auth?mode=login"}
              className="bg-black font-medium px-3 sm:px-4 py-2 rounded-md text-white"
            >
              Login
            </Link>
            <Link
              to={"/auth?mode=register"}
              className="font-medium px-4 py-2 border rounded-md"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Header;
