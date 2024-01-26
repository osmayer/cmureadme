const express = require('express');
const multer = require("multer");
const path = require("path");
const decompress = require("decompress");
var crypto = require('crypto');
var fs = require('fs');
var generateArticlePage = require("./generator")
const app = express();


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + "-" + file.originalname)
  }
})

const fileFilter = function(req, file, cb) {
  var filetypes = /zip/;
  var mimetype = filetypes.test(file.mimetype);

  var extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
  );

  if (mimetype && extname) {
      return cb(null, true);
  }

  cb(
      "Error: File upload only supports the " +
          "following filetypes - " +
          filetypes
  );

}

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: {fileSize: 1000000} })

app.get('/', (req, res) => {
  res.send('Hello World!');
});

async function unzipContents(fileName, articleHash) {
  await decompress(fileName, "./uploads/" + articleHash)
  .then((files) => {
    console.log(files);
  })
  .catch((error) => {
    console.log(error);
  });
  return null;
}
// Single file
app.post("/new_article", upload.single("file"), async (req, res) => {
  console.log(req.file.filename);
  const articleHash = crypto.createHash('sha256').update(req.file.filename).digest('hex');
  console.log(articleHash)
  await unzipContents("./uploads/" + req.file.filename, articleHash);
  await deleteFile(req.file.filename);
  await generateArticlePage(articleHash, null, null, null);
  return res.send("Single file")
})

async function deleteFile(filename) {
  fs.stat('./uploads/' + filename, async function (err, stats) {
    console.log(stats);//here we got all information of file in stats variable
 
    if (err) {
        return console.error(err);
    }
 
    fs.unlink('./uploads/' + filename,function(err){
      if(err) return console.log(err);
      console.log('file deleted successfully');
    });  
  });
}

app.listen(3000 || process.env.PORT, () => {
  console.log("Server on...")
})


