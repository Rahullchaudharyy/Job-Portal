import { signOut } from "firebase/auth";
import React from "react";
import { removeUser } from "../utils/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { auth } from "../utils/firebase.js";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { changeState } from "../utils/configSlice";
import { setSearchedJobs } from "../utils/Filter&SearchSlice";
import { addJobs, removeJob } from "../utils/jobSlice";
import { fetchJobs } from "../utils/api";
import { NavLink } from "react-router-dom";
const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchedJobs } = useSelector((state) => state.filterAndSearch) || {};
  const [ProfileDropDown, setProfileDropDown] = useState(false);
  const [SearchInput, setSearchInput] = useState("");

  const handleLogout = async () => {
    try {
      await signOut(auth);

      dispatch(removeUser());
      localStorage.removeItem("user");
      alert("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error(error.message);
    }
  };
  const handleFormState = () => {
    dispatch(changeState());
  };
  const HandleSearchInput = async () => {
    try {
      const SearchJobResults = await fetchJobs(SearchInput);
      console.log("Job Searched",SearchInput)
  
      if (SearchJobResults) {
        await dispatch(removeJob()); // Clear only if new jobs are fetched
        dispatch(addJobs(SearchJobResults)); // Add new jobs
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      // Optionally, dispatch an action or set a local state to show an error message in the UI
    }
  };
  
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
  const HandleDropDownProfile = () => {
    setProfileDropDown(!ProfileDropDown);
  };

  return (
    <div className="h-[60px] z-[99]  w-full bg-gray-950 text-white p-10 shadow-lg">
      <div className="hidden md:flex justify-between h-full items-center px-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold tracking-wide cursor-pointer hover:text-gray-300 transition">
            Logo
          </h2>
        </div>

        <div className="flex justify-start gap-10 items-center ">
         
          <input
            value={SearchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
            }}
            type="text"
            placeholder="Search Jobs"
            className="rounded-full p-3 text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={HandleSearchInput}
            className="px-2 py-1 rounded-full text-black bg-white"
          >
            Search
          </button>
          
        </div>

        <div className="relative flex gap-16">
      <NavLink
        to="/main"
        className={({ isActive }) => `cursor-pointer hover:text-gray-300 transition ${isActive ? 'bg-white p-1 text-black rounded-lg' : ''}`}
      >
        Recommended
      </NavLink>
      <NavLink
        to="/home"
        onClick={handleFormState}
        className={({ isActive }) => `cursor-pointer hover:text-gray-300 transition ${isActive ? 'bg-white p-1 text-black rounded-lg' : ''}`}
      >
        Filter
      </NavLink>
      <h1
        onClick={HandleDropDownProfile}
        className="cursor-pointer hover:text-gray-300 transition"
      >
        Profile
      </h1>
      {ProfileDropDown && (
        <div className="absolute top-full right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50">
          <nav className="grid gap-y-2 p-2 text-black">
            <NavLink
              to="/profile"
              className={({ isActive }) => `text-left hover:bg-gray-100 p-2 rounded-md ${isActive ? 'bg-white p-1 text-black rounded-lg' : ''}`}
            >
              Your Profile
            </NavLink>
            <button className="text-left hover:bg-gray-100 p-2 rounded-md">
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="text-left hover:bg-gray-100 p-2 rounded-md"
            >
              Log Out
            </button>
          </nav>
        </div>
      )}
    </div>
      </div>

      <div className="flex md:hidden justify-between  h-full items-center">
        <h2 className="text-xl font-semibold tracking-wide cursor-pointer">
          Logo
        </h2>
        <div className="hidden xs:flex ">

        <input
          type="text"
          placeholder="Search Jobs"
          className="rounded-full p-2  w-[30vmin] text-sm text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button onClick={HandleSearchInput}
 className="bg-white text-black p-1 rounded-md">Search</button>
        </div>
        <div className="relative">
          <button
            onClick={HandleDropDownProfile}
            className="focus:outline-none"
          >
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
          {ProfileDropDown && (
            <div className="absolute top-full md:hidden right-0 mt-2 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-[99]">
              <nav className="grid gap-y-2 p-2 text-black">
                <Link
                  to={"/home"}
                  onClick={handleFormState}
                  className="cursor-pointer p-2 hover:text-gray-300 transition"
                >
                  Filter
                </Link>
                <Link
                  to={"/profile"}
                  className="text-left hover:bg-gray-100 p-2 rounded-md"
                >
                  Your Profile
                </Link>
                <Link
                  to={"/main"}
                  className="text-left hover:bg-gray-100 p-2 rounded-md"
                >
                  Recomended
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-left hover:bg-gray-100 p-2 rounded-md"
                >
                  Log Out
                </button>
              </nav>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
