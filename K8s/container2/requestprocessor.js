const express = require('express');
const fs = require('fs')
const  csv = require('csv-parser');

const app = express();
app.use(express.json());

app.post("/getdata",(req,res)=>{

const data = req.body;
const fileName = data.file;
const productName = data.product;
let sum=0;
console.log(data);
console.log("change2");

function isCSVFormatValid(filePath) {
   return new Promise((resolve, reject) => {
     let headerCount = -1; 
     
     fs.createReadStream(filePath)
       .pipe(csv())
       .on('headers', (headers) => {
         headerCount = headers.length;
         if(headers[0] != 'product'  || headers[1] != 'amount'){
            resolve(false);
         }
       })
       .on('data', (row) => {
         console.log("data "+ row);
         const columnCount = Object.keys(row).length;
         if (headerCount != columnCount) {
           resolve(false);
         }
         else{
            if(row.product == productName )
            {
                  let a = parseInt(row.amount);
                  sum += a;
            }
         }
       })
       .on('end', () => {
         resolve(true);
       })
       .on('error', (error) => {
         reject(error);
       });
   });
 }


 const filePath = '../../kovarthanan_PV_dir/'+fileName;
isCSVFormatValid(filePath)
  .then((isValidFormat) => {
   
    if (isValidFormat) {
      res.json({"key":"sum",
         "message":sum});
    } else {
      res.json({"key":"error",
      "message":"Input file not in CSV format."});
    }
  })
  .catch((error) => {
    console.error('Error occurred:', error);
  });


});

app.listen(3001,()=>{
});