const express = require('express');
const fs = require('fs');
const app = express();

const url = "http://requestprocessor:3000/getdata";
const header = {
  "Content-Type": "application/json"
};

app.use(express.json());
app.post('/calculate', async (req, res) => {
  let fileNameOutput;
  let outputMessage;
  let outputkey = "error";
  const postData = req.body;
  const fileName = postData.file;
  fileNameOutput = fileName;

  async function getSumData() {
    const response = await fetch(url, {
      method: "POST",
      headers: header,
      body: JSON.stringify(postData),
    });
    const data = await response.json();
    outputkey = data.key;
    outputMessage = data.message;
  }

  async function checkFile() {
    return new Promise((resolve, reject)=>{
      fs.readFile("../file/" + fileName, "utf8", (err, data) => {
        if (err) {
          outputMessage = "File not found.";
          resolve();
        } else {
          getSumData().then(() => {
            resolve();
          });
        }
      });

    })

  }

  if (fileName == null) {
    outputMessage = "Invalid JSON input.";
  } else {
    await checkFile();
  }

  const output = {
    "file": fileNameOutput,
    [outputkey]: outputMessage
  };
  res.json(output);
});

app.listen(6000, () => {
});