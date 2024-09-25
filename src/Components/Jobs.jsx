import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Jobs = () => {
  const { id } = useParams(); 
  const jobs = useSelector((state) => state.jobs);
  const filteredJobs = useSelector((state) => state.filterAndSearch.filteredJobs) || [];

  const [JobDetail, setJobDetail] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const Job = jobs.find((job) => job.job_id === id)   
    const filteredJob = filteredJobs.find((job) => job.job_id === id)   


    if (Job) {
      setJobDetail(Job) 
    } else if(filteredJob){
        setJobDetail(filteredJob) 

    } else {
      console.error(`Job with ID ${id} not found.`);
      navigate('/main');
    }
  }, [id, jobs, navigate]);

  if (!JobDetail) {
    return <div>Loading...</div>; 
  }

  return (<>
  
  
  <Navbar/>
  
    <div className="job-detail min-h-screen max-h-auto w-full bg-yellow-500 flex flex-col justify-center items-center p-6 md:p-12">
    <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-full">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{JobDetail.job_title}</h1>
      <h2 className="text-xl font-semibold text-gray-700 mb-2">{JobDetail.employer_name}</h2>
      <p className="text-gray-600 mb-4">{JobDetail.job_description}</p>
      <p className="text-gray-600 mb-4 font-bold">Employment Type: {JobDetail.job_employment_type.toLowerCase()
      }</p>
      <h3 className="text-lg text-gray-800 mb-2">
        Location: <span className="font-medium">{JobDetail.job_city}, {JobDetail.job_country}</span>
      </h3>
      <h3 className="text-lg text-gray-800 mb-4">
        Salary: <span className="font-medium">{JobDetail.job_max_salary ? `$${JobDetail.job_max_salary}` : 'Not disclosed'}</span>
      </h3>
      <a
        href={JobDetail.job_apply_link}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-500 transition duration-300"
      >
        Apply Now
      </a>
    </div>
  </div>
  </>
  );
}

export default Jobs;
