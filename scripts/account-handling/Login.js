const express = require("express");
const router = express.Router();

const validator = require("validator");
const multer = require('multer');
const upload = multer();

const sqlite3 = require("sqlite3").verbose();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

router.post('/', upload.none(), async (req, res) => {
    if (!validator.isAlphanumeric(req.body.username)) {
        res.send({
          error: {
            title: "Username must be alphanumeric!"
          }
        });
    } else {
        let db = new sqlite3.Database(require("path").join(__dirname, "../../data/database.db"), (err) => {
          if (err) {
            console.log(err);
          }
        });

        db.get(`SELECT author_id, username, password_hashed FROM authors WHERE username = ?`, [req.body.username], function(err, row) {
          db.close();
          if (err) {
            console.log(err);
          } else {
            if (row) {
              bcrypt.compare(req.body.password, row.password_hashed, function(err, result) {
                if (err) {
                  console.log(err);
                } else {
                  if (result) {
                    let author = {
                      author_id: row.author_id
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
            } else {
              res.send({
                error: {
                  title: "Username does not exist!",
                  message: "If you're an author and believe you should have an account, please contact a member of the README tech team."
                }
              });
            }
          }
        });
    }
});

module.exports = router;