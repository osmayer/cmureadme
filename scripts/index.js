const express = require('express');
const multer = require("multer");
const path = require("path");
const decompress = require("decompress");
var crypto = require('crypto');
var fs = require('fs');
var generateArticlePage = require("./generator")
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));



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
  var filetypes = /zip|png|jpg|jpeg/;
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

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: {fileSize: 1000000000} })

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
app.post("/new_article", upload.fields([{name: "article" }, { name: "header"}]), async (req, res) => {
  console.log(req);
  console.log(JSON.stringify(req.files));
  console.log(req.body);
  console.log(req.route)
  const articleHash = crypto.createHash('md5').update(req.files.article[0].filename).digest('hex');
  await unzipContents("./uploads/" + req.files.article[0].filename, articleHash);
  await moveHeaderImage(req.files.header[0].filename, articleHash+"_header."+req.files.header[0].mimetype.split("/")[1]);
  await generateArticlePage(articleHash, req.body.articleTitle, req.body.articleTitle, "../assets/" + articleHash+"_header."+req.files.header[0].mimetype.split("/")[1], Date.now(), );
  await clearUploads(req.files.article[0].filename, articleHash);
  return res.send("File was uploaded!!");
})

async function clearUploads(zipName, unzippedName) {
  fs.stat('./uploads/' + zipName, async function (err, stats) {
    console.log(stats);//here we got all information of file in stats variable
 
    if (err) {
        return console.error(err);
    }
 
    fs.unlink('./uploads/' + zipName,function(err){
      if(err) return console.log(err);
      console.log('file deleted successfully');
    });  
  });

  fs.stat('./uploads/' + unzippedName, async function (err, stats) {
    console.log(stats);//here we got all information of file in stats variable
 
    if (err) {
        return console.error(err);
    }
 
    fs.rm('./uploads/' + unzippedName, { recursive: true }, function(err){
      if(err) return console.log(err);
      console.log('file deleted successfully');
    });  
  });
}

async function moveHeaderImage(filename, filetarget) {
  try {
    fs.renameSync("./uploads/" + filename, "../public/generated_content/assets/" + filetarget);
  } catch (err) {
      console.error("Error moving file:", err);
  } 
}


app.listen(process.env.PORT || 3000, () => {
  console.log("Server on...")
})


