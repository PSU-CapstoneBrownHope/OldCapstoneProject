require('dotenv').config();
import { response, Router } from 'express';
import passport from 'passport';
import airtable from 'airtable';
import * as local from 'passport-local';
import bcrypt from 'bcrypt';
import async from 'async';
import nodemailer from 'nodemailer';
import crypto from 'crypto';
import { convertCompilerOptionsFromJson, createTypeOperatorNode } from 'typescript';

const localStrategy = local.Strategy;
const airtableApiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.BASE_ID;
const base = new airtable({apiKey: airtableApiKey}).base(baseId);
const airtableRouter = Router();

/**
 * @swagger
 * /airtable/login:
 *  post:
 *    summary: Attempt a login with a username and password
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        schema:
 *          type: object
 *          required:
 *            - username
 *            - password
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *    responses:
 *      200:
 *        description: A string of either Success or Failed
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
airtableRouter.post('/login', function(req, res, next) {
  passport.authenticate('local', function(error, user, info) {
    if(error) {
        console.log("Error: " + error);
    } else if (!user) {
        // invalid username or password
        console.log(info.message);
        res.send("Failed")
    } else {
        req.login(user, function(err) {
            if (err) { return next(err); }
            console.log("Successfully logged in");
            res.send("Success")
          });
    }
  })(req, res, next);
});

/*
This endpoint is for the case where a new user is creating an
account, but they already have information in the system from
prior interactions with BRF (not through the app). When they
attempt to sign up with an email address that is already in the
Form Respnses table, they should receive a link that will allow
them to claim their account (linking the row created for them in
the Users table - with their username and password - to their 
row in the Form Responses table with the rest of their info.
*/
airtableRouter.post('/signup/verify/:token' , function(req, res, next) {
  const token = req.body.token;
  const password = req.body.password;
  // split the token received from the front end
  const user_record_id = 'rec' + token.split('-')[0];
  const form_record_id = 'rec' + token.split('-')[1];
  async.waterfall([
    // Check that the user id from the token is correct
    // this should be the record id for the user's record
    // in the Users table. Retrieve their password if it
    // exists.
    function(done) {
      base('Users').find(user_record_id, function(err, record) {
        if (err) {
          console.error(err);
        }
        done(err, record.fields.Password)
      })
    },
    // compare the password on file with the entered password
    // do this to prevent others from abusing the link
    function(password_on_file, done) {
      if (password_on_file == null) {
        done(null, null);
      }
      else {
        bcrypt.compare(password, password_on_file, function(err, hash_res) {
          if (err) {
            console.error(err);
            done(err, null);
          }
          else if (hash_res) {
            console.log("Passwords Match");
            done(err, hash_res);
          }
          else {
            console.log("Password Does Not Match");
            done(err, false);
          }
        });
      }
    },

    // Update the form responses record to link the two tables
    function(is_match, done) {
      if (is_match == null) {
        done (null, false, null)
      }
      else if (is_match == false) {
        done(null, false, true)
      }
      else {
        const fields = {'Users': [user_record_id]};
        base('Form Responses').update([{'id': form_record_id,
                                       'fields':fields,
                                      }], 
                                      function(err, update_record) {
                                        if (err) {
                                          console.error(err);
                                          done(null, false, false);
                                        }
                                        else {
                                          done(null, true, null);
                                        }
                                      });
      }
    },
    // send the appropriate message back to the user
    function(success, pass_match, done) {
      if(success) {
        res.send("Success");
        done();
      }
      else {
        if (pass_match == false) {
          res.send("Failed");
        }
        else{
          res.send("NoMatch");
        }
        done();
      }
    }
  ], function (err) {
      if (err) {
        console.error(err);
        res.send("Failed");
      }
  });
});

/**
 * @swagger
 * /airtable/signup:
 *  post:
 *    summary: Attempt to sign up with username, password and email
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        schema:
 *          type: object
 *          required:
 *            - username
 *            - password
 *            - email
 *          properties:
 *            username:
 *              type: string
 *            password:
 *              type: string
 *            email:
 *              type: string
 *    responses:
 *      200:
 *        description: A string of either Success or "Email Already Exists"
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
airtableRouter.post('/signup', function(req, res, next) {
  const username = req.body.username;
  const email = req.body.email;
  const password = req.body.password;
  async.waterfall ([
    // hash the new user password
    function(done) {
      console.log("Hashing new user password");
      bcrypt.hash(password, Number(process.env.SALT), function(err, hash) {
        if (err) {
          console.error(err);
          done(err);
        }
        else {
          console.log("Success");
          console.log(hash);
          done(err, hash);
        }
      });
    },
    // make sure the user does not already exist
    function(hashed_pw, done) {
      console.log(hashed_pw);
      base('Users').select({filterByFormula: `Username = "${username}"`}).firstPage((err, records) => {
        if (err) {
          console.error(err);
        }
        else if (records.length == 0) {
          console.log("Create new user...");
          done(err, hashed_pw, true);
        }
        else {
          console.log("User already exists");
          done(err, hashed_pw, false);
        }
      });
    },
    // create the new user record in users table and return the record_id
    function(hashed_pw, do_signup, done) {
      if (do_signup == false) {
        done(null, false, null);
      }
      else{
        base('Users').create([
          {
            "fields": {
              "Username": username,
              "Password": hashed_pw
            }
          }
        ], function(err, record_new){
          if (err) {
            console.error(err);
            done(err, false, null);
          }
          else {
            console.log("Success")
            console.log("Record Id: " + record_new[0].getId())
            done(err, do_signup, record_new[0].getId());
          }
        });
      }
    },
    // ensure that the record does not already exist
    function(do_signup, record_id, done) {
      if (do_signup == false) {
        done(null, do_signup, record_id, null);
      }
      else {
        base("Form Responses").select({filterByFormula: `Email = "${email}"`}).firstPage((err, records) => {
          if (err) {
            console.error(err);
            done(err, false, null, null, null);
          }
          else if (records.length > 0) {
            console.log("Email Exists in Form Responses Already");
            done(err, do_signup, record_id, records[0].getId(), records[0].fields.Name);
          }
          else {
            console.log("Create New Form Responses Record");
            done(err, do_signup, record_id, null, null);
          }
        });
      }
    },
    // associate the record id to the Form Responses table
    function(do_signup, record_id, fr_record_id, name, done) {
      if (do_signup == false ) {
        done(null, do_signup, null, null);
      }
      // There is not a record in the Form Respnonses table already,
      // create a new record with the record id from the users table
      else if (fr_record_id == null) {
        console.log("Associating Record ID")
        base('Form Responses').create([
          {
            fields: {
              "Users" : [record_id],
              "Email" : email
            }
          }
        ], function(err, record_new) {
          if(err) {
            console.error(err);
            done(err, false, null, null);
          }
          else {
            done(err, do_signup, null, null);
          }
        });
      }
      // The user had information entered in the Form Responses table already
      // but did not have an online account. Update the email address and 
      // record id to reflect the appropriate user
      else {
        const token = record_id.substring(3, record_id.length) 
                      + '-' 
                      + fr_record_id.substring(3, fr_record_id.length);
        done(null, do_signup, token, name);
      }
    },
    // Report back to front end!
    function(do_signup, token, name, done) {
      if(do_signup) {
        if (token == null) {
          console.log("Send success message");
          res.send("Success");
        }
        else {
          console.log("Send email")
          console.log("Create SMTP Transport")
          const smtpTransport = nodemailer.createTransport({
            // host: "smtp.mailtrap.io",
            // port: 2525,
            service: 'gmail',
            auth: {
              user: process.env.NOREPLY_EMAIL,
              pass: process.env.NOREPLY_PASS
            }
          });
          const mail_info = {
            to: email,
            from: process.env.NOREPLY_EMAIL,
            subject: process.env.RESET_SUBJECT,
            text: 'Hello ' + name + ','
                  + '\n\n' 
                  + 'You are receiving this email because you are attempting '
                  + 'to create an account on our app to manage your existing '
                  + 'profile in our system. To claim your account, please use '
                  + 'the link below and enter your password to verify that it '
                  + 'is you. Once you have claimed your account you will be '
                  + 'able to log in with the username you proviced: '
                  + username + '.'
                  + '\n\n' 
                  + 'http://' + process.env.RESET_SERVER + '/signup/verify/' + token 
                  + '\n\n' + 'If you did not request this, please ignore this email.'
                  + '\n\n'
                  + 'Thank you,\n'
                  + 'The BRF Team'
          };
          smtpTransport.sendMail(mail_info,)
          res.send("Emailed")
        }
        done(null);
      }
      else {
        console.log("Send failed message");
        res.send("Failed");
        done(null);
      }
    }
  ], function(err) {
    if (err) {
      console.error(err);
      res.send("Failed");
    }
  });
});

/**
 * @swagger
 * /airtable/isLoggedIn:
 *  get:
 *    summary: Check if a user is logged in via session data
 *    responses:
 *      200:
 *        description: A string of either the username or False
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
 airtableRouter.get("/isLoggedIn", function (req, res, next) {
  if (req.user) {
    res.send(req.user);
  } else {
    res.send("False");
  }
});

airtableRouter.post('/signout', function(req, res, next) {
  req.logout();
  res.send("Success");
});

/**
 * @swagger
 * /airtable/update_password:
 *  post:
 *    summary: Allow user to update their password in airtable
 *    consumes: 
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: user
 *        schema: 
 *          type: object
 *          required:
 *            - username
 *            - old_password
 *            - new_password
 *            - new_password_verify
 *          properties:
 *            username:
 *              type: string
 *            old_password:
 *              type: string
 *            new_password: 
 *              type: string
 *            new_password_verify: 
 *              type: string
 *    responses:
 *      200: 
 *        description: A string response "Success" or "Failure"
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
airtableRouter.post('/update_password', function(req, res, next) {
  const username =  req.user[0].fields.Username;
  const old_password = req.body.old_password;
  const new_password = req.body.new_password;
  const new_password_verify = req.body.new_password_verify;
  
  // get user
  base('Users').select({filterByFormula: `Username = "${username}"`}).firstPage((err, records) => {
    if (err) {
      console.error(err)
    };
    if (records.length == 0 || records.length > 1) {
      console.log("User Does Not Exist")
      res.send("Failed")
    };
    // get record id and old password hash from user records
    const record_id = records[0].getId()
    const hashed_password = records[0].fields.Password
    // compare input old password to current password
    bcrypt.compare(old_password, hashed_password, function(err, hash_res) {
      if (err) {
        console.error(err)
      }
      else if (hash_res) {
        // old password is a match, hash and compare new password
        // before assigning
        bcrypt.hash(new_password, 10, function(err, hash) {
          // compare both entries for new password to ensure no user typos
          bcrypt.compare(new_password_verify, hash, function(err, res_verify) {
            if (err) {
              console.error(err)
            }
            else if (res_verify) {
              // both new passwords match, new password hashed, update user password
              base('Users').update([{'id': record_id, 'fields': {'Password': hash},}], function(err, update_record) {
                if (err) {
                  console.error(err)
                };
                console.log("New Password Updated")
                res.send("Success")
                // redirect user to logged in page? or somewhere?
              })
            }
            else {
              console.log("New passwords do not match each other")
              res.send("Failed")
            }
          })
        })
      }
      else {
        console.log("Old Password does not match")
        res.send("Failed")
      }
    })
  });
});

/**
 * @swagger
 * /airtable/getInfo:
 *  get:
 *    summary: Receive user information from airtable
 *    responses:
 *      200:
 *        description: A string of either the user data as it exists in airtable or null
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 *      401:
 *        description: No such user exists
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
 airtableRouter.post("/getInfo", function (req, res) {
  try {
    const userName = req.body.userName;
    const fields = {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      address: "",
      emailAddress: "",
      contactMethod: "",
      paymentMethod: "",
    };
    base("Form Responses")
      .select({ filterByFormula: `Users = "${userName}"` })
      .firstPage((err, records) => {
        if (err) console.error(err);
        if (records.length != 1)
          res.status(401).send({ error: "No such user exists" });
        const recordID = records[0].getId();
        base("Form Responses").find(recordID, (err, record) => {
          if (err) {
            console.error(err);
            return;
          }
          if (record) {
            const {
              Name: fullName,
              Phone: phoneNum,
              "Delivery Address": addr,
              Email: eAddr,
              "Preferred Contact Method": contact,
              "Funding Type": fType,
              ...rest
            } = record.fields;
            const first = fullName.split(" ")[0];
            const last = fullName.split(" ")[1];
            fields.firstName = first;
            fields.lastName = last;
            fields.phoneNumber = phoneNum;
            fields.address = addr;
            fields.emailAddress = eAddr;
            fields.contactMethod = contact;
            fields.paymentMethod = fType;
            res.write(JSON.stringify(fields));
          } else {
            res.write(JSON.stringify(null));
          }
          res.end();
        });
      });
  } catch (err) {
    console.error(err);
    throw err;
  }
});

/**
 * @swagger
 * /airtable/update:
 *  get:
 *    summary: Update user information from airtable
 *    responses:
 *      204:
 *        description: Update occurred
 *      403:
 *        description: Invalid user
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 *      422:
 *        description: Invalid syntax
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
airtableRouter.post("/update", function (req, res) {
  try {
    const fields = {
      Name: "",
      Phone: "",
      "Delivery Address": "",
      Email: "",
      "Preferred Contact Method": "",
      "Funding Type": "",
    };
    const {
      userName,
      firstName,
      lastName,
      ...fieldsToChange
    } = req.body.reduce(
      (acc, field) => ({ [field.name]: field.value, ...acc }),
      {}
    );
    fieldsToChange.Name = `${firstName} ${lastName}`;
    for (const field in fieldsToChange) {
      switch (field) {
        case "address":
          fields["Delivery Address"] = fieldsToChange[field];
          break;
        case "Name":
          fields.Name = fieldsToChange[field];
          break;
        case "phoneNumber":
          fields.Phone = fieldsToChange[field];
          break;
        case "emailAddress":
          fields.Email = fieldsToChange[field];
          break;
        case "contactMethod":
          fields["Preferred Contact Method"] = fieldsToChange[field];
          break;
        case "paymentMethod":
          fields["Funding Type"] = fieldsToChange[field];
          break;
      }
    }

    base("Form Responses")
      .select({ filterByFormula: `Users = "${userName}"` })
      .firstPage((err, records) => {
        if (err) console.error(err);
        if (records.length != 1)
          return res.status(403).send({ error: "Unauthorized user" });

        const recordID = records[0].getId();
        base("Form Responses")
          .update(recordID, fields, (err, record) => {
            if (err) {
              return res.status(422).send({ error: "Invalid syntax" });
            }
            return record;
          })
          .catch((err) => {
            return res.status(422).send({ error: err.toString() });
          });
      });
  } catch (err) {
    console.log(err);
    throw err;
  }
});

airtableRouter.get("/allApplications", function (req, res) {
  if (req.user) {
    try {
      base('Mutual Aid').select({sort: [{field: "Created Time", direction: "desc"}], filterByFormula: `{Username}='${req.user[0].fields.Username}'`}).firstPage((err, records) => {
        if (err) {
          console.log('Could not connect to Airtable');
          res.send("False");
        } else {
          console.log(records)
          res.send(records)
        }
      })
    } catch(e) {console.log("Error inside first page function: " + e)}
  } else {
    console.log("User not logged in")
    res.send("False")
  }
});

passport.serializeUser(function(user, callback) {
  callback(null, user);
});

passport.deserializeUser(function(user, callback) {
  callback(null, user);
});

passport.use(
  new localStrategy(
    { usernameField: "username", passwordField: "password" },
    function (username, password, done) {
      base("Users")
        .select({ filterByFormula: `Username = "${username}"` })
        .firstPage((err, records) => {
          if (err) {
            return done(null, false, {
              message: "Could not connect to Airtable",
            });
          }
          if (records.length == 0 || records.length > 1) {
            return done(null, false, { message: "User not found" });
          }
          bcrypt.compare(
            password,
            records[0].fields.Password,
            function (err, res) {
              if (err) {
                console.log("There was an error validating the password");
                return done(err);
              } else if (res) {
                // successful match
                return done(null, records);
              } else {
                // bad password
                return done(null, false, { message: "Incorrect Password" });
              }
            }
          );
        });
    }
  )
);

export default airtableRouter;