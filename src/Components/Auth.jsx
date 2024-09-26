import React, { useState, useEffect } from 'react';
import { auth, googleProvider, db } from '../utils/firebase';
import { useDispatch } from 'react-redux';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, sendPasswordResetEmail } from 'firebase/auth';
import { addUser, removeUser } from '../utils/userSlice';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const SignIn = () => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    JobPrefrence: '',
    location: '',
    qualification: '',
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setuserInfo] = useState()
  const dispatch = useDispatch();
  const navigate = useNavigate()




  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
  
        if (userSnapshot.exists()) {
          setuserInfo(userSnapshot.data()); 
          // console.log(userSnapshot.data()); 
          
        } else {
          console.log('No such user!');
        }
        navigate('/main')
      } else {
        console.log('User is not logged in');
        navigate('/')
        setuserInfo(null); // Reset user info
      }
    });
  
    return () => unsubscribe();
  }, [auth]);


const handleInputChange = (event) => {
  const inputName = event.target.name;
  const inputValue = event.target.value;
  
  setFormData((prevFormData) => ({
    ...prevFormData,
    [inputName]: inputValue 
  }));
};

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      const userData = { email: user.email, uid: user.uid };
      alert('Logged in successfully');
      dispatch(addUser(userData));
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  const HandleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, formData.email);
      alert('Password reset email sent , please check the email and reste the password');
    } catch (error) {
      setError(error.message);
    }
  };
  
  const handleSignUp = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      await setDoc(doc(db, 'users', user.uid), {
        displayName: formData.name,
        ...formData,
      });
      const userData = { email: user.email, uid: user.uid, ...formData };
      alert('Signed up successfully');
      dispatch(addUser(userData));
      localStorage.setItem('user', JSON.stringify(userData));    
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;
      dispatch(addUser({ email: user.email, uid: user.uid }));
      alert('Logged in with Google successfully');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700">{isSignUp ? 'Sign Up' : 'Login'}</h2>
        
        {error && <div className="text-red-500 mb-4">{error}</div>}
        
        {isSignUp && (
          <input required={true} type="text" name="name" placeholder="Name" value={formData.name} onChange={handleInputChange} className="w-full p-2 mb-4 border border-gray-300 rounded-lg" />
        )}

        <input required={true} type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} className="w-full p-2 mb-4 border border-gray-300 rounded-lg" />
        <input  required={true}type="password" name="password" placeholder="Password" value={formData.password} onChange={handleInputChange} className="w-full p-2 mb-4 border border-gray-300 rounded-lg" />
        <button onClick={HandleForgotPassword} className="mb-2 text-blue-500 underline">
          {isSignUp ? undefined : 'Forgot password ?'}
        </button>
        {isSignUp && (
          <>
            <input required={true} type="text" name="JobPrefrence" placeholder="JobPrefrence" value={formData.JobPrefrence} onChange={handleInputChange} className="w-full p-2 mb-4 border border-gray-300 rounded-lg" />
            <input required={true} type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} className="w-full p-2 mb-4 border border-gray-300 rounded-lg" />
            <input required={true} type="text" name="qualification" placeholder="Qualification" value={formData.qualification} onChange={handleInputChange} className="w-full p-2 mb-4 border border-gray-300 rounded-lg" />
          </>
        )}

        <button onClick={isSignUp ? handleSignUp : handleLogin} className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors mb-4" disabled={loading}>
          {loading ? 'Loading...' : (isSignUp ? 'Sign Up' : 'Login')}
        </button>

        {/* <button onClick={handleGoogleSignIn} className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 transition-colors mb-4" disabled={loading}>
          Login with Google
        </button> */}

        <button onClick={() => setIsSignUp(!isSignUp)} className="mt-4 text-blue-500 underline">
          {isSignUp ? 'Already have an account? Login' : 'Don\'t have an account? Sign Up'}
        </button>
      </div>
    </div>
  );
};

export  default SignIn;
