import React, { useState } from 'react';
import axios, * as others from 'axios'

import './index.css'; // Import the CSS file
import DataTable from './DataTable'; // Replace './DataTable' with the path to the DataTable component

const UserDetailsForm = () => {
  // Function to navigate back to the home page
  const goBack = () => {
    window.location.href = '/';
  }
  const handleInputChange = (e) => {
    setEmail(e.target.value);
  };

  // State hooks for storing user data and email input value
  const [userdata, setuserdata] = useState([]);
  const [email, setEmail] = useState('');

  // API endpoint URL constructed using environment variables
  // const url = 'https://pxozgmbq4j.execute-api.us-east-1.amazonaws.com/prod/gettaxdocumentdetails/?email=kova@gmail.com'; // Replace this with your API endpoint
  console.log("kova");
  console.log(process.env.REACT_APP_TEST_KEY)
  const url = process.env.REACT_APP_TEST_KEY + '/' + process.env.REACT_APP_METHOD_PATH + '/?email=' + email;

  // Default data to be posted to the API
  const postData = {
    "email": ""
  }

  // Function to fetch user data from the API using async/await and axios
  const fetchData = async () => {
    await axios.post(url, postData)
      .then(response => {
        console.log(response);
        setuserdata(response.data.Items);
      })
      .catch(error => {
        console.log("error");
      });
  };

  return (
    <div className="container">
      <div className="card1">
        <div className="info">
          <span>Tax Document details</span>
          <h1>Enter the email to get details</h1>
          <input type="text" value={email} onChange={handleInputChange} />
          <button onClick={fetchData}>Get details</button>
        </div>
        <DataTable items={userdata} />
      </div>
      <div></div>
      <button id="detailsPageBackButton" onClick={goBack}>Go Back</button>
    </div>
  );
};

export default UserDetailsForm;
