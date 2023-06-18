const express = require('express');
const fs = require('fs');
const app = express();

const url = "http:/localhost:3001/getdata";
const header = {
  "Content-Type": "application/json"
};

app.use(express.json());
app.post('/store-file',async(req,res) =>{
  const content = req.body.data;
  const file = req.body.file;
  
  let outputkey = "message";
  let outputMessage = "Success."

  
  if (typeof content === 'string' && file != null) {
    const addData = content.replace(/ /g, '');
    fs.writeFile('../../kovarthanan_PV_dir/'+file,addData,err =>{
    
      if(err){
        console.log(err);
        console.log("deploy1");
        outputkey = "error"
        outputMessage = "Error while storing the file to the storage."
      }
      console.log("outside");
  
      const output = {
        "file": file,
        [outputkey]: outputMessage
      };
      
      res.json(output);
      
    })
  } else {
    let outputErrorMessage = 'Error while storing the file to the storage.'
    if(file == null){
      outputErrorMessage = "Invalid JSON input." 
  }
  else{

  }
  const output = {
    "file": file,
    "error": outputErrorMessage
  };
    
    res.json(output);
  }




  });
app.post('/calculate', async (req, res) => {
  let fileNameOutput;
  let outputMessage;
  let outputkey = "error";
  const postData = req.body;
  console.log(postData);
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
    let outputint = data.message
    outputMessage = outputint.toString();
  }

  async function checkFile() {
    return new Promise((resolve, reject)=>{
      fs.readFile("../../kovarthanan_PV_dir/"+ fileName, "utf8", (err, data) => {
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

app.listen(6001, () => {
});