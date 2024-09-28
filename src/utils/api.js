import axios from 'axios';

export const fetchJobs = async (query) => {
  const options = {
    method: 'GET',
    url: 'https://jsearch.p.rapidapi.com/search', 
    params: { query: query, page: '1', num_pages: '1' },  
    headers: {
      'x-rapidapi-key': 'c4ed9d0b82mshcb3ea468c023248p131d2cjsn0722ca666692',
      'x-rapidapi-host': 'jsearch.p.rapidapi.com'
    }
       // headers: {
      // 'x-rapidapi-key': process.env.REACT_APP_REPIDAPI_KEY,
    //   'x-rapidapi-host': process.env.REACT_APP_REPIDAPI_HOST
    // }
  };

  try {
    const response = await axios.request(options);
    console.log(response.data);  // Logs the job data
    return response.data
  } catch (error) {
    console.error("Error fetching jobs:", error.response ? error.response.data : error.message);  
  }
};


// fetchJobs("NodeJs developer delhi fulltime");


