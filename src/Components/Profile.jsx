import React, { useState, useEffect } from 'react';
import { auth, db } from '../utils/firebase.js'; // Adjust the path as necessary
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useDispatch } from 'react-redux';
import { addUser } from '../utils/userSlice';
import Navbar from './Navbar';

const Profile = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    location: '',
    JobPrefrence: '',
    qualification: '',
    password: ''
  });

  const [isEditing, setIsEditing] = useState(false);
   const dispatch = useDispatch()
  // Function to get current user info from Firestore
  const getCurrentUserInfo = async () => {
    const user = auth.currentUser;
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      // console.log(userDocRef)
      const userDoc = await getDoc(userDocRef);
      // console.log(userDoc)
      if (userDoc.exists()) {
        const userInfo = await { uid: user.uid, ...userDoc.data() };

        setUserData(userInfo);
        dispatch(addUser(userInfo))

      } else {
        console.log("No such document!");
      }
    } else {
      console.log("No user is logged in");
    }
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await getCurrentUserInfo();
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({ ...userData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      await updateDoc(userDocRef, {
        name: userData.name,
        email: userData.email,
        location: userData.location,
        jobPrefrence: userData.JobPrefrence,
        qualification: userData.qualification
      });
      setIsEditing(false);
      console.log("User data updated successfully");
    } else {
      console.log("No user is logged in");
    }
  };

  return (loading ? (
    <div>Loading profile...</div>
  ) :<>
  
  
      <Navbar/>
    <div className="profile-page h-screen w-full bg-gray-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>
        {isEditing ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <input
                type="text"
                name="name"
                value={userData.name}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={userData.email}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={userData.location}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Job Preference</label>
              <input
                type="text"
                name="jobPreference"
                value={userData.jobPreference}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Qualification</label>
              <input
                type="text"
                name="qualification"
                value={userData.qualification}
                onChange={handleChange}
                className="border border-gray-300 rounded px-3 py-2 w-full"
                required
              />
            </div>
          
            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-300 w-full">
              Update Profile
            </button>
          </form>
        ) : (
          <div>
            <p className="text-gray-700 mb-2"><strong>Name:</strong> {userData.name}</p>
            <p className="text-gray-700 mb-2"><strong>Email:</strong> {userData.email}</p>
            <p className="text-gray-700 mb-2"><strong>Location:</strong> {userData.location}</p>
            <p className="text-gray-700 mb-2"><strong>Job Prefrence:</strong> {userData.JobPrefrence}</p>
            <p className="text-gray-700 mb-2"><strong>Qualification:</strong> {userData.qualification}</p>
            <button onClick={() => setIsEditing(true)} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-300">
              Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  </>
  );
};

export default Profile;
