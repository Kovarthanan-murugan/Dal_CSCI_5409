import grpc
import helloworld_pb2
import helloworld_pb2_grpc
import boto3
from concurrent import futures
from urllib.parse import urlparse
import requests
import json

class EC2OperationsServicer(helloworld_pb2_grpc.EC2OperationsServicer):
    bucketname = "b00936880learning" 
    key = "test.txt"

    def StoreData(self, request, context):
        # TODO: Implement the logic to store data

        s3 = boto3.resource('s3')
        data = request.data
        url = "https://"+self.bucketname+".s3.amazonaws.com/"+self.key
        s3.Bucket(self.bucketname).put_object(Key=self.key, Body=data)
        # print(url1)
        response = helloworld_pb2.StoreReply(s3uri=url)
        return response

    def AppendData(self, request, context):
        # TODO: Implement the logic to append data
        s3 = boto3.client('s3')
        # Retrieve the existing content of the file
        response = s3.get_object(Bucket=self.bucketname, Key=self.key)
        existing_content = response['Body'].read().decode('utf-8')

        # Append the new content to the existing content
        updated_content = existing_content + request.data
        print(updated_content)
        s3.put_object(Body=updated_content, Bucket=self.bucketname, Key=self.key)
        response = helloworld_pb2.AppendReply()
        return response

    def DeleteFile(self, request, context):
        # TODO: Implement the logic to delete a file
        
        parsed_url = urlparse(request.s3uri)
        bucket_name = parsed_url.netloc.split('.')[0]
        object_key = parsed_url.path.lstrip('/')
        print(parsed_url)
        print(bucket_name)
        print(object_key)
        s3 = boto3.client('s3')
        s3.delete_object(Bucket=bucket_name,Key=object_key)
        response = helloworld_pb2.DeleteReply()
        return response


def serve():
    server = grpc.server(futures.ThreadPoolExecutor(max_workers=10))
    helloworld_pb2_grpc.add_EC2OperationsServicer_to_server(EC2OperationsServicer(), server)
    server.add_insecure_port('[::]:50052')
    server.start()
    print("Server started, listening on port 50051")
    print("insideserve")
    #callmethod()
    server.wait_for_termination()

def callmethod():
    print("insidecall")
    payload = {
        'banner': 'B00936880',
        'ip': '3.82.156.115:50052'
    }

    # Set the content type header
    headers = {
        'Content-Type': 'application/json'
    }

    # Make a POST request
    response = requests.post('http://54.173.209.76:9000/start', data=json.dumps(payload), headers=headers)
    
    # Check the response status code
    if response.status_code == 200:
        # Print the response content
        print(response.text)
    else:
        print('Request failed with status code', response.status_code)



if __name__ == '__main__':
    serve()
    
