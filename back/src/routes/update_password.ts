require('dotenv').config();
import Router, { response } from 'express';
import airtable from 'airtable';
import async from 'async';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import { collapseTextChangeRangesAcrossMultipleVersions, convertCompilerOptionsFromJson } from 'typescript';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.BASE_ID;
const base = new airtable({apiKey: airtableApiKey}).base(baseId);
const resetRouter = Router();

resetRouter.post('/forgot', function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  try {
    base('Users').select({filterByFormula: `Username = "${username}"`}).firstPage((err, records) => {
      if (err) {
        console.error(err)
        // error communicating with airtable
        res.send("Failed")
        return;
      };
      if (records.length == 0 || records.length > 1) {
        console.log("User DNE")
        // user does not exist in airtable
        res.send("Failed")
        return;
      };
      const record_id = records[0].getId();
      // user exists, genereate reset link
      // use waterfall to ensure asnyc functions execute
      // in the desired order.
      async.waterfall ([
        // generate a reset token for the user
        function(done) {
          console.log("Crypto");
          crypto.randomBytes(20, function(err,buff) {
              const token = buff.toString('hex')
              done(err, token);
          });
        },
        // store the reset token in the database associated with
        // the user
        function(token, done) {
          console.log("Storing user reset token")
          // give user 1 hour to reset their password
          // switch comment lines for test
          const timeout = Date.now() + 3600000;
          // const timeout = Date.now();
          console.log(timeout)
          base('Users').update([{'id':  record_id,
                                 'fields': {'reset_token': token, 'reset_timestamp': timeout},}],
                                 function(err, update_record) {
                                     if(err) {
                                        console.error(err)
                                        // there was an error storing the link in airtable
                                        res.send("Failed");
                                     };
                                     console.log("Token Updated")
                                 });
          done(err, token);
        },
        // create smtp transport and send reset email


        //                            ******* NOTE *******
        // for GMail accounts need to enable access for 'less secure apps' or nodemailer
        // will not be able to senf the email.
        // follow this link and sign in to a google account to toggle the setting:
        // https://www.google.com/settings/security/lesssecureapps

        
        function(token, done) {
          console.log("Create smptp transport")
          const smtpTransport = nodemailer.createTransport({
            // host: "smtp.mailtrap.io",
            // port: 2525,
            service: 'gmail',
            auth: {
              user: process.env.NOREPLY_EMAIL,
              pass: process.env.NOREPLY_PASS
            }
          });
          console.log("Sending update email")
          const mail_info = {
            to: email,
            from: process.env.NOREPLY_EMAIL,
            subject: process.env.RESET_SUBJECT,
            text: 'Hello, ' + username + '\n\n' +
                  'You are receiving this email because you requested a password reset. Please use the following link:\n\n' +
                  'http://' + process.env.RESET_SERVER + '/reset/' + token + '\n\n' +
                  'If you did not request this, please ignore this email'
          };
          smtpTransport.sendMail(mail_info, function(err) {
            if (err) {
              console.error(err);
            };
            done(err, 'Success');
          });
          console.log("Password reset email sent successfully")
          res.send("Success");
        }
      ], function(err) {
          if (err) return next(err);
          res.send("Failed");
      });
      // send reset email
    })
  } catch (e) {console.error(e)}
});

resetRouter.get('/:token', function(req, res) {
  console.log(req.params.token)
  base('Users').select({filterByFormula: `reset_token = "${req.params.token}"`}).firstPage((err, records) => {
    if (err) {
      console.error(err)
    }
    else if (records.length == 0) {
      console.log("Invalid Reset Token")
      res.send("Failed")
    }
    else {
      console.log("Username Found")
      console.log(records[0].fields.Username)
    }
  });
});

resetRouter.post('/:token', function(req, res) {
  console.log(req.body.token)
  console.log(req.body.new_password)
  console.log(req.body.password_verify)
  async.waterfall([
    // make sure that token is valid
    function(done) {
      base('Users').select({filterByFormula: `reset_token = "${req.body.token}"`}).firstPage((err, records) => {
        if (err) {
          console.error(err)
        }
        else if (records.length == 0) {
          console.log("Invalid Reset Token")
          res.send("Failed")
        }
        else if (Date.now() > records[0].fields.reset_timestamp) {
          console.log("Past Timeout!")
          res.send("Failed")
          done(err, null)
        }
        else {
          console.log("Valid Reset Token")
          const record_id = records[0].getId()
          done(err, record_id);
        }
      });
    },
    // hash new password
    function(record_id, done) {
      if (record_id != null){
        console.log("Hashing new password")
        bcrypt.hash(req.body.new_password, Number(process.env.SALT), function(err, hash_res) {
            if (err) {
            console.error(err)
            }
            else {  
              console.log("Password Hashed");
              done(err, hash_res, record_id);
            }
        });
      }
      else {
        done(null, null, null);
      }
    },
    // compare hashed passwords
    function(hash_res, record_id, done) {
      if (hash_res != null) {
        console.log("Comparing Passwords")
        bcrypt.compare(req.body.password_verify, hash_res, function(err, verified) {
            if (err) {
            console.error(err)
            };
            console.log("Passwords Compared")
            done (err, verified, hash_res, record_id);
        });
      }
      else {
        done (null, null, null, null);
      }
    },
    // update password if match
    function(verified, hash, record_id, done) {
      if (verified != null) {
        if (verified) {
            console.log("Passwords match")
            base('Users').update([{'id': record_id,
                                'fields': {'Password': hash},}],
                                function(err, update_record) {
                                    if (err) {
                                    console.error(err)
                                    };
                                    console.log("Password Updated")
                                    res.send("Success")
                                    done(err);
                                })
        }
        else {
            console.log("Passwords do not match")
            res.send("Failed")
            done();
        }
      }
      else {
        done();
      }
    }
  ], function(err) {
      if (err) res.redirect('/');
  });
});

export default resetRouter;