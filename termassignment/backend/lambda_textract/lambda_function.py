import webbrowser, os
import json
import boto3
import io
from io import BytesIO
import sys
from pprint import pprint
from PIL import Image, ImageDraw
import os
##########
# Reference:
# [1] Amazon Web Services, Inc., “Amazon Textract examples using SDK for Python,” Amazon Web Services, Inc., 2023. [Online]. Available:https://docs.aws.amazon.com/code-library/latest/ug/python_3_textract_code_examples.html. [Accessed 25 06 2023].
##########


def get_rows_columns_map(table_result, blocks_map):
    rows = {}
    scores = []
    for relationship in table_result['Relationships']:
        if relationship['Type'] == 'CHILD':
            for child_id in relationship['Ids']:
                cell = blocks_map[child_id]
                if cell['BlockType'] == 'CELL':
                    row_index = cell['RowIndex']
                    col_index = cell['ColumnIndex']
                    if row_index not in rows:
                        # create new row
                        rows[row_index] = {}
                    
                    # get confidence score
                    scores.append(str(cell['Confidence']))
                        
                    # get the text value
                    rows[row_index][col_index] = get_text(cell, blocks_map)
    return rows, scores


def get_text(result, blocks_map):
    text = ''
    if 'Relationships' in result:
        for relationship in result['Relationships']:
            if relationship['Type'] == 'CHILD':
                for child_id in relationship['Ids']:
                    word = blocks_map[child_id]
                    if word['BlockType'] == 'WORD':
                        if "," in word['Text'] and word['Text'].replace(",", "").isnumeric():
                            text += '"' + word['Text'] + '"' + ' '
                        else:
                            text += word['Text'] + ' '
                    if word['BlockType'] == 'SELECTION_ELEMENT':
                        if word['SelectionStatus'] =='SELECTED':
                            text +=  'X '
    return text


def get_table_csv_results(document,bucket):

    
    session = boto3.Session(
        aws_access_key_id=os.environ['aws_access_key_id'],
        aws_secret_access_key=os.environ['aws_secret_access_key'],
        aws_session_token=os.environ['aws_session_token']
    )
    client = session.client('textract', region_name='us-east-1')

    s3_connection = session.resource('s3')
    s3_object = s3_connection.Object(bucket,document)
    s3_response = s3_object.get()

    stream = io.BytesIO(s3_response['Body'].read())
    # image=Image.open(stream)

    # Analyze the document
    image_binary = stream.getvalue()
    response = client.analyze_document(Document={'Bytes': image_binary}, FeatureTypes=['TABLES'])

    # Get the text blocks
    blocks=response['Blocks']
    # pprint(blocks)

    blocks_map = {}
    table_blocks = []
    for block in blocks:
        blocks_map[block['Id']] = block
        if block['BlockType'] == "TABLE":
            table_blocks.append(block)

    if len(table_blocks) <= 0:
        return "<b> NO Table FOUND </b>"

    csv = ''
    print("going to print the data")
    for index, table in enumerate(table_blocks):
        csv += generate_table_csv(table, blocks_map, index +1)
        # print("table "+str(table)+"---"+"blocks_map "+str(blocks_map)+"---"+"index +1 "+str(index))
        csv += '\n\n'
    # print("csv")
    # print(csv)
    return csv

def generate_table_csv(table_result, blocks_map, table_index):
    rows, scores = get_rows_columns_map(table_result, blocks_map)
    print("kko")
    print("kova",os.environ['testvariable'])
    print(rows)
    csv=''    

    orderMessage = {
        "type": "ORDER",
        "messageData": rows 
    }

    # Retrieve the SNS topic ARN to send the message from an environment variable
    sendMessagetoSNSArn = os.environ['snsTopicArn']

    # Publish the combined message to the SNS topic using sendMessageToSNS function
    sendMessageToSNS(sendMessagetoSNSArn, orderMessage)

    print(orderMessage)
    print("test",os.environ['testvariable'])
    return csv

def main(file_name,bucket):
    table_csv = get_table_csv_results(file_name,bucket)

    output_file = 'output.csv'

def sendMessageToSNS(sendMessagetoSNSArn, orderMessage):
    # Function to publish a message to an SNS topic

    """
    [2] Amazon Web Services, "Boto3 Amazon SNS API Reference," 2023. [Online]. Available: https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/sns.html. [Accessed: July 24, 2023].
    """

    # Create an SNS client
    snsClient = boto3.client('sns')

    # Publish the orderMessage to the specified SNS topic
    response = snsClient.publish(
        TopicArn=sendMessagetoSNSArn,
        Message=json.dumps(orderMessage)
    )
    print("response")
    print(response)
    print("kova",os.environ['testvariable'])


# if __name__ == "__main__":
#     file_name = "test.PNG"
#     bucket = "b00936880documentimage"
#     main(file_name,bucket)
def lambda_handler(event, context):
    eventTrigger = event['Records'][0]['s3']
    file_name = eventTrigger['object']['key']
    bucket = eventTrigger['bucket']['name']
    print("working",event)
    print("file_name",file_name)
    print("bucket",bucket)

    main(file_name,bucket)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }

