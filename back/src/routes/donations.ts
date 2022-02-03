require('dotenv').config();
import Router from 'express';
import airtable from 'airtable';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.BASE_ID;
const base = new airtable({apiKey: airtableApiKey}).base(baseId);
const donationRouter = Router();

/**
 * @swagger
 * /donations/offerServices:
 *  post:
 *    summary: Submit an application to offer services
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: application
 *        schema:
 *          type: object
 *          required:
 *            - username
 *          properties:
 *            state:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                donationServices:
 *                  type: array
 *                  items:
 *                    type: string
 *                organization:
 *                  type: string
 *                additionalInformation:
 *                  type: string
 *                contactInformation:
 *                  type: string
 *    responses:
 *      200:
 *        description: A string of either Success or False
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
donationRouter.post('/offerServices', function(req, res, next) {
  if (req.user) {
    try {
      base('Mutual Aid').select({sort: [{field: "Created Time", direction: "desc"}], filterByFormula: `AND({Username}='${req.user[0].fields.Username}', {Application Type}='Services Donation')`}).firstPage((err, records) => {
        if (err) {
          console.log('Could not connect to Airtable');
          res.send("False");
        };
        if (records.length == 0 || records[0].fields.Service_Donation_Status != "Pending") {
          const record_num = records.length + 1;
          const app_id = "Services Donation " + record_num.toString();
          base('Mutual Aid').create([
            {
              "fields": {
                "Application_ID": app_id,
                "Username": req.user[0].fields.Username,
                "Application Type": "Services Donation",
                "Services Offered": req.body.donationServices.join(', '),
                "Organization/Business": req.body.organization,
                "Service Donation Additional Information": req.body.additionalInformation,
                "Service Donation Contact Information": req.body.contactInformation,
                "Service_Donation_Status": "Pending"
              }
            }
          ], function(err, records) {
            if (err) {
              console.error("Error: " + err);
              res.send("False")
            }
            else {
              const application_id = records[0].getId()
              base('Users').select({filterByFormula: `Username = "${req.user[0].fields.Username}"`}).firstPage((err, records) => {
                if (err) {
                  console.log('Could not connect to Airtable');
                  res.send("False")
                } else {
                  const record_id = records[0].getId()
                  let mutual_aid = []
                  if (records[0].fields.Mutual_Aid) {
                    mutual_aid = records[0].fields.Mutual_Aid
                  }
                  mutual_aid.push(application_id)
                  console.log(mutual_aid)
                  base('Users').update([
                    {
                      "id": record_id,
                      "fields": {
                        "Mutual_Aid": mutual_aid
                      }
                    }
                  ], function(err, updated_record) {
                    if (err) {
                      console.error(err)
                      res.send("False")
                    } else {
                    console.log("Application Created")
                    res.send("Success")
                    }
                  })
              }})
            }
          });
        } else {
          const record_id = records[0].getId()
          base('Mutual Aid').update([
            {
              "id": record_id,
              "fields": {
                "Services Offered": req.body.donationServices.join(', '),
                "Organization/Business": req.body.organization,
                "Service Donation Additional Information": req.body.additionalInformation,
                "Service Donation Contact Information": req.body.contactInformation,
              }
            }
          ], function(err, updated_record) {
            if (err) {
              console.error(err)
              res.send("False")
            };
            console.log("Application Updated")
            res.send("Success")
          })
        }
      })
    } catch(e) {console.log("Error inside first page function: " + e)}
  } else {
    res.send("False");
  }
})

/**
 * @swagger
 * /donations/offerGoods:
 *  post:
 *    summary: Submit an application to offer goods
 *    consumes:
 *      - application/json
 *    parameters:
 *      - in: body
 *        name: application
 *        schema:
 *          type: object
 *          required:
 *            - username
 *          properties:
 *            state:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                donationItems:
 *                  type: array
 *                  items:
 *                    type: string
 *                additionalInformation:
 *                  type: string
 *                contactInformation:
 *                  type: string
 *    responses:
 *      200:
 *        description: A string of either Success or False
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
 donationRouter.post('/offerGoods', function(req, res, next) {
  if (req.user) {
    try {
      base('Mutual Aid').select({sort: [{field: "Created Time", direction: "desc"}], filterByFormula: `AND({Username}='${req.user[0].fields.Username}', {Application Type}='Goods Donation')`}).firstPage((err, records) => {
        if (err) {
          console.log('Could not connect to Airtable');
          res.send("False");
        };
        if (records.length == 0 || records[0].fields.Goods_Donation_Status != "Pending") {
          const record_num = records.length + 1;
          const app_id = "Goods Donation " + record_num.toString();
          base('Mutual Aid').create([
            {
              "fields": {
                "Application_ID": app_id,
                "Username": req.user[0].fields.Username,
                "Application Type": "Goods Donation",
                "Goods Offered": req.body.donationItems.join(', '),
                "Goods Donation Additional Information": req.body.additionalInformation,
                "Goods Donation Contact Information": req.body.contactInformation,
                "Goods_Donation_Status": "Pending"
              }
            }
          ], function(err, records) {
            if (err) {
              console.error("Error: " + err);
              res.send("False")
            }
            else {
              const application_id = records[0].getId()
              base('Users').select({filterByFormula: `Username = "${req.user[0].fields.Username}"`}).firstPage((err, records) => {
                if (err) {
                  console.log('Could not connect to Airtable');
                  res.send("False")
                } else {
                  const record_id = records[0].getId()
                  let mutual_aid = []
                  if (records[0].fields.Mutual_Aid) {
                    mutual_aid = records[0].fields.Mutual_Aid
                  }
                  mutual_aid.push(application_id)
                  console.log(mutual_aid)
                  base('Users').update([
                    {
                      "id": record_id,
                      "fields": {
                        "Mutual_Aid": mutual_aid
                      }
                    }
                  ], function(err, updated_record) {
                    if (err) {
                      console.error(err)
                      res.send("False")
                    } else {
                    console.log("Application Created")
                    res.send("Success")
                    }
                  })
              }})
            }
          });
        } else {
          const record_id = records[0].getId()
          base('Mutual Aid').update([
            {
              "id": record_id,
              "fields": {
                "Goods Offered": req.body.donationItems.join(', '),
                "Goods Donation Additional Information": req.body.additionalInformation,
                "Goods Donation Contact Information": req.body.contactInformation,
              }
            }
          ], function(err, updated_record) {
            if (err) {
              console.error(err)
              res.send("False")
            };
            console.log("Application Updated")
            res.send("Success")
          })
        }
      })
    } catch(e) {console.log("Error inside first page function: " + e)}
  } else {
    res.send("False");
  }
})

export default donationRouter;