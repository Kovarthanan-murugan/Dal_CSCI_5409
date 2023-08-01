/*
*
*
Reference:
  Amazon Web Services, Inc., “Getting started in Node.js,” Amazon Web Services, Inc., 2023. [Online]. Available:https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/getting-started-nodejs.html. [Accessed 19 05 2023].
*
*
*/

import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  ScanCommand,
  PutCommand,
  GetCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import {SubscribeCommand } from "@aws-sdk/client-sns";
import  { SNSClient } from "@aws-sdk/client-sns";
// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create SNS service object.
const snsClient = new SNSClient({ region: REGION });
import {ListSubscriptionsByTopicCommand } from "@aws-sdk/client-sns";

const client1 = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client1);

export const handler = async (event) => {
  console.log("working");
  console.log(event)
  // TODO implement
  const response = {
    statusCode: 200,
    body: JSON.stringify('Hello from Lambda!'),
  };
  
  const snsMessage = event.Records[0].Sns
  console.log("snsMessage",snsMessage)
// Parse the JSON string inside the 'Message' key to get the inner JSON object
const innerMessageObj = JSON.parse(snsMessage.Message);
console.log("innerMessageObj",innerMessageObj)

// Access the value of the 'type' property inside the inner JSON object
const messageType = innerMessageObj.type;

// Access the value of the 'messageData' property inside the inner JSON object
const messageData = innerMessageObj.messageData;
console.log("messageData",messageData)

  // Access the 'carType' property inside the 'messageData' object
  const carType = messageData;

function findKeyByValue(obj, value) {
  return Object.keys(obj).find(key => obj[key]['1'] === value);
}
 console.log("before");
let emailAddress='';
const emailKey = findKeyByValue(carType, 'Email address ');
if (emailKey) {
  emailAddress = carType[emailKey]['2'].trim();
  console.log("emailaddress");
  console.log(emailAddress);
} else {
  console.log("Email address not found in the data.");
}
console.log("after");
  // Create a DynamoDB client

  // Iterate through each property (e.g., "1", "2") inside the 'carType' object
  for (const key in carType) {
    console.log("inside for loop",emailAddress)
    // Get the "1" key (e.g., "First name") and "2" value (e.g., "Kovarthanan")
    const attributeKey = carType[key]["1"];
    const attributeValue = carType[key]["2"];

    // Create an object representing the item to be stored in DynamoDB
    await dynamo.send(
    new PutCommand({
    // TableName: 'extractedDataFromForm',
    TableName:process.env.Extracted_Data_Table,
    Item: {
        email:emailAddress,
        key:attributeKey,
        value:attributeValue
      
    },
  })
);  

    // Store the item in DynamoDB
  }
  
const params = {
  Protocol: "email" /* required */,
  TopicArn: process.env.SNS_Topic_Alert_Arn, //TOPIC_ARN
  Endpoint: emailAddress, //EMAIL_ADDRESS
};

const run = async () => {
  console.log("run");
  try {
    const data = await snsClient.send(new SubscribeCommand(params));
    console.log("Success.",  data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err.stack);
  }
};
await run();
  return response;
};
