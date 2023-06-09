import requests
import json

# Prepare the payload
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
print(response.status_code)

# Check the response status code
if response.status_code == 200:
    # Print the response content
    print(response.text)
else:
    print('Request failed with status code', response.status_code)