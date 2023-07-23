// Importing necessary modules: crypto for hashing and axios for making HTTP requests.
import crypto from 'crypto';
import axios from 'axios';

// Exporting the main handler function which will be executed when this module is invoked.
export const handler = async (event) => {
  console.log("event", event); // Logging the entire incoming event object.
  console.log("event", event.value); // Logging the 'value' property of the incoming event object.

  // Extracting the input value from the incoming event object.
  const inputString = event.value;

  // Generating a hashed output of the input string using MD5 algorithm from crypto module.
  const hashedOutput = crypto.createHash('md5').update(inputString).digest('hex');

  // Extracting the 'action' value from the incoming event object.
  const action = event.action;

  console.log('lambda_md5:', hashedOutput); // Logging the MD5 hashed output.

  try {
    // Creating a postData object to send in the POST request.
    const postData = {
      "banner": "B00936880",
      "result": hashedOutput, // The MD5 hashed output.
      "arn": "arn:aws:lambda:us-east-1:013229639524:function:lambda_md5",
      "action": action,
      "value": inputString // The original input string.
    };

    // Making a POST request to the specified URL with the postData object using axios.
    const response = await axios.makePostRequest(event.course_uri, postData);

    console.log('Response:', response.data); // Logging the response data from the POST request.
    return response.data; // Returning the response data.
  } catch (error) {
    console.error('Error:', error.message); // If an error occurs during the execution, log the error message.
    throw error; // Rethrow the error to propagate it further up the call stack.
  }
};
