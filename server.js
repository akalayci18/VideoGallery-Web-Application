const express = require("express");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const {Storage}  = require('@google-cloud/storage');

let videoArray = [];

const GOOGLE_CLOUD_PROJECT_ID = 'triple-shadow-318811';
const GOOGLE_CLOUD_KEYFILE = 'triple-shadow-318811-f44990165eae.json';

 const storage =  new Storage({
   projectId: GOOGLE_CLOUD_PROJECT_ID,
   keyFilename: GOOGLE_CLOUD_KEYFILE,
 });

 const bucket = storage.bucket("codewaycase-bucket");

 const mult = multer({
   storage: multer.memoryStorage(),
 });

const app = express();


app.set('view engine', 'ejs');

app.use(express.static('public'));

app.get("/", function(req, res){
  res.render("home", {cloudvideos:  videoArray });

});

app.get("/upload", function(req, res){
  res.render("upload");
});

app.post("/upload", mult.single('videofile'), function(req, res){

    let file = req.file;
      if (file) {
        uploadFileToStorage(file).then((success) => {
          res.status(200).send({
            status: 'success'
          });
        }).catch((error) => {
          console.error(error);
        });    }

});


 app.get('/video/:id', function(req, res){
   videoID = req.params.id;
    res.render("video", {videoclicked:  videoArray[videoID]});
  });

 // app.get('/video', function(req, res){
 //   res.render("video");
 //    });
/**
 * Upload the file to Google Storage
 * @param {File} file object that will be uploaded to Google Cloud
 */
const uploadFileToStorage = (file) => {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject('No uploaded file');
    }

    let newFileName = `${file.originalname}_${Date.now()}`;

    let fileUpload = bucket.file(newFileName);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: file.mimetype
      }
    });

     blobStream.on('error', (error) => {
       reject('Something is wrong! Unable to upload at the moment.');
     });

    blobStream.on('finish', () => {
      // The public URL that can be used to directly access the file through HTTP.
       const url = `https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`;
      //resolve(url);
      videoArray.push(`${url}`);
      console.log(`File uploaded with url:  ${url}`);

    });

    blobStream.end(file.buffer);
  });
}

app.listen(3000, function(){
  console.log("Server started on port 3000");
});
