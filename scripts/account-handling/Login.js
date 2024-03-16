const express = require("express");
const router = express.Router();

const validator = require("validator");
const multer = require('multer');
const upload = multer();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const firebase = require("firebase");

const firebaseConfig = {
  apiKey: process.env["FIREBASE_API_KEY"],
  authDomain: process.env["FIREBASE_AUTH_DOMAIN"],
  projectId: process.env["FIREBASE_PROJECT_ID"],
  storageBucket: process.env["FIREBASE_STORAGE_BUCKET"],
  messagingSenderId: process.env["FIREBASE_MESSAGING_SENDER_ID"],
  appId: process.env["FIREBASE_APP_ID"],
  measurementId: process.env["FIREBASE_MEASUREMENT_ID"]
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

router.post('/', upload.none(), async (req, res) => {
    if (!validator.isAlphanumeric(req.body.username)) {
        res.send({
          error: {
            title: "Username must be alphanumeric!"
          }
        });
    } else {
      const Authors = db.collection("authors");

      const snapshot = await Authors.where("username", "==", req.body.username).get();
      
      if (snapshot.empty) {
        res.send({
          error: {
            title: "Username does not exist!",
            message: "If you're an author and believe you should have an account, please contact a member of the README tech team."
          }
        });
      } else {
        snapshot.forEach(async doc => {
          console.log(req.body);
          const hash2 = await bcrypt.hash(req.body.password, 10);
          console.log(hash2)
          bcrypt.compare(req.body.password, doc.data().password_hashed, function(err, result) {
            if (err) {
              console.log(err);
            } else {
              if (result) {
                let author = {
                  author_id: doc.id
                }
                
                jwt.sign(author, process.env['JWT_PRIVATE_KEY'], function(err, token) {
                  if (err) {
                    console.log(err);
                  } else {
                    res.send({
                      success: {
                        title: "Logged in!",
                        token: token
                      }
                    });
                  }
                });
              } else {
                res.send({
                  error: {
                    title: "Wrong password!",
                    message: 'If you forgor your password and want to reset your password, please contact a member of the README tech team.'
                  }
                });
              }
            }
          });
        });
      }
    }
});

module.exports = router;