

import React, { useEffect, useState } from 'react';
import Navbar from './Navbar';
import { useNavigate } from 'react-router-dom';
import { auth } from '../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import JobFilterForm from './JobFilterForm';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Home = () => {
  const filteredJobs = useSelector((state) => state.filterAndSearch.filteredJobs) || [];
  const formState = useSelector((state) => state.config.formState);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log("User is logged in");
        setLoading(false); 
      } else {
        console.log("User is not logged in");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <Navbar />
      {formState && <JobFilterForm />}
      <div className="h-full w-full flex flex-col items-center justify-center p-4 md:p-10">
        {loading ? (
          <h1 className="text-[50px] md:text-[50px] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            Please wait while we are fetching jobs for you...
          </h1>
        ) : (
          <div className="w-full flex flex-wrap justify-center gap-6 p-7">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job, index) => (
                <Link 
                to={`/jobs/${job.job_id}`} 
                key={index}
                  className="w-full md:w-[70vmin] lg:w-[45vmin] bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between overflow-hidden relative transition-transform duration-300 hover:scale-105"
                >
                  <h1 className="text-xl font-bold text-red-600 mb-2 truncate">{job.job_title}</h1>
                  <p className="text-lg font-semibold text-gray-700 truncate">{job.employer_name}</p>
                  <p className="text-gray-500 truncate">Location: {job.job_city}/{job.job_country}</p>
                  <p className="text-lg font-semibold text-gray-700 truncate">Experience in months: {job.job_required_experience?.required_experience_in_months ? `${job.job_required_experience.required_experience_in_months} Months` : "No Experience mentioned"}</p>
                  <h2 className="text-lg font-bold text-gray-800 mt-4">
                    Salary: {job.job_max_salary ? job.job_max_salary : 'Not disclosed yet'}
                  </h2>
                  <div className="relative max-h-[100px]">
                    <p className="text-gray-600 overflow-hidden">{job.job_description.length > 20 ? job.job_description.split(' ').slice(0, 20).join(' ') + " Read more.." : job.job_description}</p>
                  </div>
                  <a
                    href={job.job_apply_link}
                    className="mt-4 bg-red-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-red-700 transition duration-300 text-center"
                  >
                    Apply
                  </a>
                </Link>
              ))
            ) : (
              < div className='flex flex-col justify-center items-center'>
              
              <p className="text-lg font-semibold text-gray-700">
                No jobs available. Or the API call limit might have been exceeded. Please inform us at 
                <a 
                  href="mailto:rahulchaudhary9611@gmail.com" 
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  rahulchaudhary9611@gmail.com
                </a>.
              </p>
              <p className="text-lg flex font-semibold text-gray-700">

or You have not add the filter data                 <a 
                  href="mailto:rahulchaudhary9611@gmail.com" 
                  className="text-blue-600 underline hover:text-blue-800"
                >
                </a>.
              </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
