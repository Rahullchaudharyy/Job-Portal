import React, { useEffect, useState } from 'react';
import Navbar from './Components/Navbar';
import { Outlet, useNavigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { useDispatch, useSelector } from 'react-redux';
import { auth, db } from './utils/firebase';
import { addUser, removeUser } from './utils/userSlice';
import { doc, getDoc } from 'firebase/firestore';
import { fetchJobs } from './utils/api';
import { addJobs } from './utils/jobSlice';

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { JobPrefrence, location } = useSelector((state) => state.user) || {}; // Use a fallback to avoid destructuring null
  const jobs = useSelector((state)=> state.jobs)

  const [Loading, setLoading] = useState(true)
  console.log("JoB Fetched from app compo ", jobs)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);
        
        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();

          // Check if user data already exists in the Redux store
          if (!JobPrefrence && !location) {
            dispatch(addUser({ email: user.email, uid: user.uid, ...userData }));
            localStorage.setItem('userData', JSON.stringify({ email: user.email, uid: user.uid, ...userData }));

            try {
              const RecomendJobs = await fetchJobs(`${userData.JobPrefrence} ${userData.location}`);

              if (RecomendJobs.data && RecomendJobs.data.length > 0) {
                dispatch(addJobs(RecomendJobs.data))
                // RecomendJobs.data.forEach((job) => {
                //   const JobTitle = job.job_title || "N/A";
                //   const Company_Name = job.employer_name || "N/A";
                //   const JobDescription = job.job_description || "N/A";
                //   const Location = job.job_country || "N/A";
                //   const Salary = job.job_max_salary || "N/A";
                //   const Remote_Q = job.job_is_remote ? "Yes" : "No";
                //   const Apply_Link = job.job_apply_link || "N/A";

                //   console.log(JobTitle, Company_Name, JobDescription, Salary, Location, Remote_Q, Apply_Link);
                // });
                setLoading(!Loading)
              } else {
                console.log("No jobs found.");
              }

            } catch (error) {
              console.error("Error fetching jobs:", error);
            }

            console.log(userSnapshot.data());
            navigate('/main');
          } else {
            console.log('User already exists in Redux store.');
            navigate('/main'); // Navigate to main even if user data already exists
          }
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
  }, [dispatch, navigate, JobPrefrence, location]);

  return (
    <>
      <Navbar />
      {/* <div className='h-full w-[100vw] bg-yellow-200 flex p-10 items-center justify-center'>

      {Loading?<h1 className='text-[200px]'>Loading....</h1>: <div className='flex flex-col gap-10'>
        {jobs.length > 0 ? (
          jobs.map((job, index) => (
  <div className='h-[30vmin] overflow-scroll w-[50vmin] rounded-lg bg-white shadow-lg p-6 flex flex-col justify-between'>
    <h1 className='text-2xl font-bold text-red-600 mb-2'>{job.job_title}</h1>
    
    <p className='text-lg font-semibold text-gray-700'>{job.employer_name}</p>
    <p className='text-gray-500'>Company Address</p>

    <h2 className='text-lg font-bold text-gray-800 mt-4'>Salary</h2>
    <p className='text-gray-600'>{job.job_description}</p>
    
    <a href ={job.job_apply_link} className='mt-6 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition duration-300'>
      Apply
    </a>
  </div>

          ))
        ) : (
          <p>No jobs available.</p>
        )}
      </div>}
      </div> */}
 <div className='h-full w-full bg-yellow-200 flex p-10 items-center justify-center'>
      {Loading ? (
        <h1 className='text-[200px] text-center'>Loading...</h1>
      ) : (
        <div className='flex flex-col gap-10'>
          {jobs.length > 0 ? (
            jobs.map((job, index) => (
              <div
                key={index}
                className='h-auto w-[50vmin] rounded-lg bg-white shadow-lg p-6 flex flex-col justify-between overflow-hidden relative'
              >
                <h1 className='text-2xl font-bold text-red-600 mb-2'>{job.job_title}</h1>

                <p className='text-lg font-semibold text-gray-700'>{job.employer_name}</p>
                <p className='text-gray-500 truncate'>Company Address</p>

                <h2 className='text-lg font-bold text-gray-800 mt-4'>Sallery:{job.job_max_salary?job.job_max_salary:"Not disclosed Yet"}</h2>
                <p className='text-gray-600 overflow-y-auto max-h-[60%]'> {/* Limit height for overflow */}
                  {job.job_description}
                </p>

                <a
                  href={job.job_apply_link}
                  className='mt-6 bg-red-600 text-white font-semibold py-2 rounded-lg hover:bg-red-700 transition duration-300'
                >
                  Apply
                </a>

                {/* Optional: Show more text if truncated */}
                <span className='absolute bottom-2 right-2 text-gray-500 text-sm'>
                  {job.job_description.length > 100 ? '...more' : ''}
                </span>
              </div>
            ))
          ) : (
            <p className='text-lg font-semibold text-gray-700'>No jobs available.</p>
          )}
        </div>
      )}
    </div>


    </>
  );
};

export default App;