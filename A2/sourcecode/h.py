import requests
import json

# Prepare the payload
payload = {
    'name': 'John Doe',
    'email': 'johndoe@example.com'
}

# Set the content type header
headers = {
    'Content-Type': 'application/json'
}

# Make a POST request
response = requests.post('https://kova.requestcatcher.com/test', data=json.dumps(payload), headers=headers)

# Check the response status code
if response.status_code == 200:
    # Print the response content
    print(response.text)
else:
    print('Request failed with status code', response.status_code)