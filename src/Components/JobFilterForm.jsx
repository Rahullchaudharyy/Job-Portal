import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { changeState, resetFilters, updateFilters } from '../utils/configSlice';
import { fetchJobs } from '../utils/api.js';
import { resetJobs, setFilteredJobs } from '../utils/Filter&SearchSlice.js';

const JobFilterForm = () => {
  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    jobType: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(changeState());
    dispatch(updateFilters(formData));
    dispatch(resetJobs())
  
    try {
      const jobData = await fetchJobs(formData.jobTitle + " " + formData.location + " " + formData.jobType);
  
      // console.log("Fetched job data:", jobData); 
  
      if (jobData.data && jobData.data.length > 0) {
        dispatch(resetFilters()); 
        // console.log("Jobs being dispatched:", jobData.data);
        dispatch(setFilteredJobs(jobData.data)); 
  
        jobData.data.forEach((job) => {
          const JobTitle = job.job_title || "N/A";
          const Company_Name = job.employer_name || "N/A";
          const JobDescription = job.job_description || "N/A";
          const Location = job.job_country || "N/A";
          const Salary = job.job_max_salary || "N/A";
          const Remote_Q = job.job_is_remote ? "Yes" : "No";
          const Apply_Link = job.job_apply_link || "N/A";
  
          // console.log({ JobTitle, Company_Name, JobDescription, Location, Salary, Remote_Q, Apply_Link });
        });
      } else {
        console.log("No jobs found.");
        dispatch(resetFilters());
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    }
  };
  

  const resetForm = (e) => {
    e.preventDefault();
    setFormData({
      jobTitle: '',
      company: '',
      location: '',
      jobType: '',
    });
    dispatch(resetFilters());
  };

  return (
    <div className="job-filter-form h-auto w-auto   bg-gray-100 p-6 rounded-lg shadow-lg z-[99]">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-700">Filter Jobs</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex flex-col">
          <label htmlFor="jobTitle" className="text-gray-600">Job Title</label>
          <input
            required={true}
            type="text"
            id="jobTitle"
            name="jobTitle"
            placeholder="Enter job title"
            value={formData.jobTitle}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="company" className="text-gray-600">Company (Optional)</label>
          <input
            type="text"
            id="company"
            name="company"
            placeholder="Enter company name"
            value={formData.company}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="location" className="text-gray-600">Location</label>
          <input
            required={true}
            type="text"
            id="location"
            name="location"
            placeholder="Enter location"
            value={formData.location}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          />
        </div>

        <div className="flex flex-col">
          <label htmlFor="jobType" className="text-gray-600">Job Type</label>
          <select
            required={true}
            id="jobType"
            name="jobType"
            value={formData.jobType}
            onChange={handleChange}
            className="p-2 border rounded focus:outline-none focus:ring focus:ring-blue-300"
          >
            <option value="">All</option>
            <option value="full-time">Full-Time</option>
            <option value="part-time">Part-Time</option>
            <option value="remote">Remote</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Filter
        </button>
        <button
          onClick={resetForm}
          className="w-full p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
        >
          Reset
        </button>
      </form>
    </div>
  );
};

export default JobFilterForm;
