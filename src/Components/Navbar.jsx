import { signOut } from "firebase/auth";
import React from "react";
import { removeUser } from "../utils/userSlice";
import { useDispatch } from "react-redux";
import { auth } from "../utils/firebase";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect,useState } from "react";
import { changeState } from "../utils/configSlice";


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
  const handleFormState = ()=>{

    dispatch(changeState())
  }
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
    <div className="h-[60px] fixed w-full bg-gradient-to-r from-gray-800 to-gray-600 text-white shadow-lg">
    {/* Navbar for Desktop */}
    <div className="hidden md:flex justify-between h-full items-center px-6">
      {/* Left: Logo */}
      <div className="flex items-center space-x-4">
        <h2 className="text-2xl font-semibold tracking-wide cursor-pointer hover:text-gray-300 transition">Logo</h2>
      </div>
  
      {/* Center: Links & Search */}
      <div className="flex justify-center items-center space-x-8">
        <h2 className="cursor-pointer hover:text-gray-300 transition">Home</h2>
        <Link to={'/home'} onClick={handleFormState} className="cursor-pointer hover:text-gray-300 transition">Filter</Link>
        <input
          type="text"
          placeholder="Search Jobs"
          className="rounded-full p-2 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
  
      {/* Right: Profile Dropdown */}
      <div className="relative">
        <h1 onClick={HandleDropDownProfile} className="cursor-pointer hover:text-gray-300 transition">Profile</h1>
        {ProfileDropDown && (
          <div className="absolute top-full right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
            <nav className="grid gap-y-2 p-2 text-black">
              <button className="text-left hover:bg-gray-100 p-2 rounded-md">Your Profile</button>
              <button className="text-left hover:bg-gray-100 p-2 rounded-md">Settings</button>
              <button onClick={handleLogout} className="text-left hover:bg-gray-100 p-2 rounded-md">Log Out</button>
            </nav>
          </div>
        )}
      </div>
    </div>
  
    {/* Navbar for Mobile */}
    <div className="flex md:hidden justify-between h-full items-center px-4">
      {/* Left: Logo */}
      <h2 className="text-xl font-semibold tracking-wide cursor-pointer">Logo</h2>
  
      {/* Right: Hamburger Menu */}
      <div className="relative">
        <button onClick={HandleDropDownProfile} className="focus:outline-none">
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
        {ProfileDropDown && (
          <div className="absolute top-full md:hidden right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-[99]">
            <nav className="grid gap-y-2 p-2 text-black">
            <Link to={'/home'} onClick={handleFormState} className="cursor-pointer p-2 hover:text-gray-300 transition">Filter</Link>
              <button className="text-left hover:bg-gray-100 p-2 rounded-md">Home</button>
              <button className="text-left hover:bg-gray-100 p-2 rounded-md">Search Jobs</button>
              <button className="text-left hover:bg-gray-100 p-2 rounded-md">Your Profile</button>
              <button onClick={handleLogout} className="text-left hover:bg-gray-100 p-2 rounded-md">Log Out</button>
            </nav>
          </div>
        )}
      </div>
    </div>
  </div>
  
  );
};

export default Navbar;
