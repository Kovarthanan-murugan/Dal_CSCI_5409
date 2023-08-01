import React, { useState } from 'react';
import AWS from 'aws-sdk';
import './index.css'; // Import the CSS file

const UserDetailsForm = () => {
  // State hooks for managing the selected file and uploading status
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Retrieving AWS configuration from environment variables
  const BUCKET_NAME = process.env.REACT_APP_BUCKET_NAME;
  const REGION = process.env.REACT_APP_REGION;
  const ACCESS_KEY = process.env.REACT_APP_ACCESS_KEY;
  const SECRET_KEY = process.env.REACT_APP_SECRET_KEY;
  const AWS_SESSION_TOKEN = process.env.REACT_APP_AWS_SESSION_TOKEN;

  // Function to handle file selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Function to navigate back to the home page
  const goBack = () => {
    window.location.href = '/';
  };

  // Function to handle file upload to AWS S3
  const handleFileUpload = () => {
    if (!selectedFile) return;

    setUploading(true);

    // Configure AWS with your credentials
    AWS.config.update({
      accessKeyId: ACCESS_KEY,
      secretAccessKey: SECRET_KEY,
      sessionToken: AWS_SESSION_TOKEN,
      region: REGION,
    });

    const s3 = new AWS.S3();

    const params = {
      Bucket: BUCKET_NAME,
      Key: selectedFile.name,
      Body: selectedFile,
      ACL: 'public-read', // Change the ACL to your preference
    };

    // Upload the file to S3
    s3.upload(params, (err, data) => {
      if (err) {
        console.error('Error uploading file:', err);
      } else {
        console.log('File uploaded successfully:', data);
        // You can handle success response here, e.g., update the state or show a success message.
      }
      setUploading(false);
    });
  };

  return (
    <div className="container">
      <div className="card3">
        <div className="info">
          <span>Upload Your Tax Document Here</span>
        </div>
        <div className="forms">
          <div className="inputs">
            <span>Upload Here</span>
            <input type="file" onChange={handleFileChange} className="file-input" />
            <button onClick={handleFileUpload} disabled={uploading} className="upload-button">
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>
        <button id="uploadPageBackButton" onClick={goBack}>Go Back</button>
      </div>
    </div>
  );
};

export default UserDetailsForm;
