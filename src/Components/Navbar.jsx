import { signOut } from "firebase/auth";
import React from "react";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { auth } from "../utils/firebase";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect,useState } from "react";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [ProfileDropDown, setProfileDropDown] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth);

      dispatch(removeUser());
      localStorage.removeItem('user'); 
      alert("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };
  // handleLogout()
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is loggedin ");
      } else {
        console.log("User is not logged in");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [auth]);
  const HandleDropDownProfile =()=>{
      setProfileDropDown(!ProfileDropDown)
  }
  return (
    <div className="h-[60px] fixed w-[100%] bg-gray-600 flex justify-between">
      <div id="Desktop" className="flex justify-between h-full w-full items-center px-6">
        <div className="flex justify-between h-full w-[50%] items-center">
          <h2>Logo</h2>
        </div>
        <div className="flex justify-between h-full w-[50%] items-center px-5">
          <h2>Home</h2>
          <input placeholder="Search Job " className="p-2 h-1" />
          <div className="relative">
            <h1 onClick={HandleDropDownProfile}>Profile</h1>{
              ProfileDropDown&&   <div className="absolute top-full right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
              <nav className="grid gap-y-2 p-2">
               <button>Your Profile</button>
               <button>Your Profile</button>
               <button onClick={handleLogout}>Log Out</button>
              </nav>
            </div>
            }
         
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
