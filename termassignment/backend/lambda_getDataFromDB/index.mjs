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

import  { SNSClient } from "@aws-sdk/client-sns";
import {PublishCommand } from "@aws-sdk/client-sns";

// Set the AWS Region.
const REGION = "us-east-1"; //e.g. "us-east-1"
// Create SNS service object.
const snsClient = new SNSClient({ region: REGION });


const client1 = new DynamoDBClient({});

const dynamo = DynamoDBDocumentClient.from(client1);

export const handler = async (event) => {
  console.log("working");
 
 console.log("event", event);
  let responseBody;
  let email = event.queryStringParameters.email;

  if (event.resource == "/gettaxdocumentdetails") {
    console.log("inside event path");
    const body = await dynamo.send(new ScanCommand({ 
    TableName: process.env.Extracted_Data_Table,
    FilterExpression: "#email = :emailid",
    ExpressionAttributeNames: {
      "#email": "email"
    },
    ExpressionAttributeValues: {
      ':emailid':email  // Assuming 'number' is a numeric attribute
    }
  }));
   console.log("after fet data from db",body);
 responseBody= body;
  } else {
     console.log("insise else");
    responseBody = "Hello from Lambdsdsdsda!";
  }

  
  const response = {
    statusCode: 200,
     headers: {
            "Content-Type" : "application/json",
            "Access-Control-Allow-Headers" : "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods" : "OPTIONS,POST",
            "Access-Control-Allow-Credentials" : true,
            "Access-Control-Allow-Origin" : "*",
            "X-Requested-With" : "*"
        },
    body: JSON.stringify(responseBody),
  };
  
  // Set the parameters
var params = {
  Message: "Hi"+email+"your account details been fetched", // MESSAGE_TEXT
  TopicArn:process.env.SNS_Topic_Alert_Arn , //TOPIC_ARN
};

const run = async () => {
  try {
    const data = await snsClient.send(new PublishCommand(params));
    console.log("Success.",  data);
    return data; // For unit tests.
  } catch (err) {
    console.log("Error", err.stack);
  }
};
await run();
  
   console.log("before response");
  return response;
};


