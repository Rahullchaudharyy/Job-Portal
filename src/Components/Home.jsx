import React from 'react'
import Navbar from './Navbar'
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import JobFilterForm from './JobFilterForm'
import { useSelector } from 'react-redux';

const Home = () => {
  const formState = useSelector((state) => state.config.formState);
  const navigate = useNavigate()
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
  return (
    <div>
        <Navbar/>
        {formState && <JobFilterForm/>}
    </div>
  )
}

export default Home