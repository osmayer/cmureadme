require('dotenv').config();
const express = require('express');
const multer = require("multer");
const path = require("path");
const decompress = require("decompress");
var crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

var fs = require('fs');
var generateArticlePage = require("./scripts/generator")
var validateUser = require("./scripts/userKeys");
const app = express();
const cors = require('cors');
app.use(cors());
const bodyParser = require('body-parser');
const articleDb = require("./scripts/articleDB");
const indexPage = require("./scripts/indexGenerator");
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

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
  console.log(req.body)
  const articleHash = crypto.createHash('md5').update(req.files.article[0].filename).digest('hex');
  var userName; 
  try{
    userName = await validateUser(req.body.magicCode);
  } catch (e) {
      return res.status(403).send({
        message: "Authentication Error: " + e
     });
  }
  await unzipContents("./uploads/" + req.files.article[0].filename, articleHash);
  await moveHeaderImage(req.files.header[0].filename, articleHash+"_header."+req.files.header[0].mimetype.split("/")[1]);
  await generateArticlePage(articleHash, req.body.articleTitle, userName.userName, "../assets/" + articleHash+"_header."+req.files.header[0].mimetype.split("/")[1], new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), req.body.articleCategory, req.body.articleSummary);
  await articleDb.addArticleToDB(req.body.articleTitle, articleHash,  new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), req.body.articleSummary, "/generated_content/assets/" + articleHash+"_header."+req.files.header[0].mimetype.split("/")[1], req.body.articleCategory);
  await clearUploads(req.files.article[0].filename, articleHash);

  return res.json({
    "status": "sucess",
    "articleID": articleHash
  });
})

// Single file
app.post("/index_contents", async (req, res) => {
  try{
    userName = await validateUser(req.body.magicCode);
  } catch (e) {
      return res.status(403).send({
        message: "Authentication Error: " + e
     });
  }

  await indexPage.generateIndexPage(req.body);
  return res.json({
    "status": "sucess",
  });
})

app.get("/article_list", async (req, res) => {
  const dataStore = await articleDb.getArticleList();
  return res.json(JSON.parse(dataStore));
});

app.get("/podcasts/artificial-intelligence-for-real-this-time", async(req, res) => {
  res.redirect("https://youtu.be/dQw4w9WgXcQ");
});

app.get("/author", async (req, res) => {
  res.sendFile(__dirname + "/public/author.html");
});

app.use('/login', require(__dirname + "/scripts/account-handling/Login.js"));


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
    fs.renameSync("./uploads/" + filename, "./public/generated_content/assets/" + filetarget);
  } catch (err) {
      console.error("Error moving file:", err);
  } 
}


app.listen(process.env.PORT || 3000, () => {
  console.log("Server on...")
});
