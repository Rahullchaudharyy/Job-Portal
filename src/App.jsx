import React, { useEffect } from 'react';
import Navbar from './Components/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch } from 'react-redux';
import { auth, db } from './utils/firebase';
import { addUser, removeUser } from './utils/userSlice';
import { doc, getDoc } from 'firebase/firestore';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          dispatch(addUser({ email: user.email, uid: user.uid, ...userData }));

          localStorage.setItem('userData', JSON.stringify({ email: user.email, uid: user.uid, ...userData }));
          
          console.log(userSnapshot.data());
          navigate('/main');
        } else {
          console.log('No such user!');
        }
      } else {
        console.log('User is not logged in');
        dispatch(removeUser());
        localStorage.removeItem('userData');
        navigate('/');
      }
    });

    return () => unsubscribe();
  }, [auth, dispatch, navigate]);

  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};

export default App;
