// Importing necessary modules: axios for making HTTP requests and bcrypt for hashing passwords.
import axios from 'axios';
import bcrypt from 'bcryptjs';

// Function to hash a password using bcrypt.
async function bcryptHash(password) {
  try {
    const saltRounds = 12; // The number of salt rounds used for generating the hash. Higher value means stronger hash but slower processing.
    const hash = await bcrypt.hash(password, saltRounds); // Using bcrypt to generate the hash asynchronously.
    return hash; // Return the generated hash.
  } catch (error) {
    throw new Error('Error while generating bcrypt hash'); // In case of an error, throw a custom error message.
  }
}

// Function to make a POST request to a specified URL with given data.
async function makePostRequest(url, postData) {
  try {
    const response = await axios.post(url, postData); // Sending a POST request using axios and waiting for the response.
    return response; // Return the response data.
  } catch (error) {
    throw error; // If an error occurs during the POST request, rethrow the error.
  }
}

// Exporting the main handler function which will be executed when this module is invoked.
export const handler = async (event) => {
  console.log("event", event);
  console.log("event", event.value);
 
  // Extracting values from the incoming event object.
  const inputString = event.value;
  const action = event.action;

  // Generating a hashed output of the input string using bcryptHash function.
  const hashedOutput = bcryptHash(inputString);

  console.log('bcryptHash:', hashedOutput); // Logging the hashed output, but it will likely show a Promise pending since bcryptHash is asynchronous.

  console.log("bcryptHash");

  try {
    // Creating a postData object to send in the POST request.
    const postData = {
      "banner": "B00936880",
      "result": hashedOutput, // This will still be a Promise pending since bcryptHash is asynchronous.
      "arn": "arn:aws:lambda:us-east-1:013229639524:function:lambda_bcrypt",
      "action": action,
      "value": inputString
    }; 

    // Making a POST request to the specified URL with the postData object.
    const response = await makePostRequest(event.course_uri, postData);

    console.log('Response:', response.data); // Logging the response data.
    return response.data; // Returning the response data.
  } catch (error) {
    console.error('Error:', error.message); // If an error occurs during the execution, log the error message.
    throw error; // Rethrow the error to propagate it further up the call stack.
  }
};
