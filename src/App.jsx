import React, { useEffect, useState, useRef } from "react";
import Navbar from "./Components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { useDispatch, useSelector } from "react-redux";
import { auth, db } from "./utils/firebase.js";
import { addUser, removeUser } from "./utils/userSlice";
import { doc, getDoc } from "firebase/firestore";
import { fetchJobs } from "./utils/api";
import { addJobs } from "./utils/jobSlice";

const App = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { JobPrefrence, location } = useSelector((state) => state.user) || "Not recieved";
  // console.log("This is the JOb prefrence that is reciving by the app.jsx measn inn the reccomnd job ",JobPrefrence,location)
  const {searchedJobs} = useSelector((state)=>(state.filterAndSearch)) || {}
  const jobs = useSelector((state) => state.jobs);
  const [Loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const observer = useRef();

  const loadJobs = async () => {
    try {
      // console.log("This is job ",JobPrefrence)
      const RecomendJobs = await fetchJobs(`${JobPrefrence} ${location}`, page);
      const SearchedJobs = await fetchJobs(`${searchedJobs} ${location} `,page)
if (RecomendJobs.data && RecomendJobs.data.length > 0) {
        dispatch(addJobs(RecomendJobs.data));
      } else if(SearchedJobs){
        dispatch(addJobs(searchedJobs.data))
        console.log('This block is executed')
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDoc = doc(db, "users", user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (userSnapshot.exists()) {
          const userData = userSnapshot.data();
          // console.log("USER DATA ",userData)
          if (JobPrefrence && location) {
            dispatch(
              addUser({ email: user.email, uid: user.uid,JobPrefrence: userData.JobPrefrence,  location: userData.location,...userData })
            );
            localStorage.setItem(
              "userData",
              JSON.stringify({ email: user.email, uid: user.uid, ...userData })
            );
            loadJobs();
            navigate("/main");
          } else {
            console.log("User already exists in Redux store.");
            navigate("/main");
          }
        }
      } else {
        console.log("User is not logged in");
        dispatch(removeUser());
        localStorage.removeItem("userData");
        navigate("/");
      }
    });

    return () => unsubscribe();
  }, [dispatch, JobPrefrence, location]);

  useEffect(() => {
    if (Loading) return;
    loadJobs();
  }, [Loading]);

  useEffect(() => {
    const loadMoreJobs = (entries) => {
      if (entries[0].isIntersecting) {
        setPage((prev) => prev + 1);
        loadJobs();
      }
    };

    const options = {
      root: null,
      rootMargin: "0px",
      threshold: 1.0,
    };

    const observerInstance = new IntersectionObserver(loadMoreJobs, options);
    if (observer.current) {
      observerInstance.observe(observer.current);
    }

    return () => {
      if (observer.current) {
        observerInstance.unobserve(observer.current);
      }
    };
  }, [Loading]);

  return (
    <>
      <div className="h-auto w-[100vw]">
        <Navbar />
        <div className="h-full w-full  flex flex-col items-center justify-center p-4 md:p-10">
          {Loading && jobs.length === 0 ? (
            <h1 className="text-[50px] md:text-[50px]  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              Please Wait while we are fetching jobs for you ...
            </h1>
          ) : (
            <div className="w-full flex flex-wrap justify-center gap-6 p-7">
              {jobs.length > 0 ? (
                jobs.map((job, index) => (
                  <Link
                    to={`/jobs/${job.job_id}`}
                    key={index}
                    className="w-full md:w-[70vmin] lg:w-[45vmin] bg-white rounded-lg shadow-lg p-4 flex flex-col justify-between overflow-hidden relative transition-transform duration-300 hover:scale-105"
                  >
                    <h1 className="text-xl font-bold text-red-600 mb-2 truncate">
                      {job.job_title}
                    </h1>
                    <p className="text-lg font-semibold text-gray-700 truncate">
                      {job.employer_name}
                    </p>
                    <p className="text-gray-500 truncate">
                      Location {job.job_city}/{job.job_country}
                    </p>
                    <p className="text-lg font-semibold text-gray-700 truncate">
                      Experience in months:{" "}
                      {job.job_required_experience.required_experience_in_months
                        ? job.job_required_experience
                            .required_experience_in_months + "Months"
                        : "No Experience mentioned"}{" "}
                    </p>
                    <h2 className="text-lg font-bold text-gray-800 mt-4">
                      Salary:{" "}
                      {job.job_max_salary
                        ? job.job_max_salary
                        : "Not disclosed Yet"}
                    </h2>
                    <div className="relative max-h-[100px] ">
                      <p className="text-gray-600 overflow-hidden">
                        {job.job_description.length > 20
                          ? job.job_description
                              .split(" ")
                              .slice(0, 20)
                              .join(" ") + " Read more.."
                          : job.job_description.length}
                      </p>
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
                // <p className="text-lg font-semibold text-gray-700">
                //   No jobs available. Or the API call limit might have been
                //   exceeded. Please inform us at
                //   <a
                //     href="mailto:rahulchaudhary9611@gmail.com"
                //     className="text-blue-600 underline hover:text-blue-800"
                //   >
                //     rahulchaudhary9611@gmail.com
                //   </a>
                //   .
                // </p>
                <h1>Loading...</h1>
              )}
            </div>
          )}
          <div ref={observer} style={{ height: "20px" }} />
        </div>
      </div>
    </>
  );
};

export default App;
