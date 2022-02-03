require('dotenv').config();
import Router from 'express';
import airtable from 'airtable';

const airtableApiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.BASE_ID;
const base = new airtable({apiKey: airtableApiKey}).base(baseId);
const aidRouter = Router();

/**
 * @swagger
 * /aid/applyForServices:
 *  post:
 *    summary: Submit an application for services
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
 *                yardWork:
 *                  type: boolean
 *                yardWorkNote:
 *                  type: string
 *                carMaintenance:
 *                  type: boolean
 *                carMaintenanceNote:
 *                  type: string
 *                therapy:
 *                  type: boolean
 *                therapyNote:
 *                  type: string
 *                junkFurniture:
 *                  type: boolean
 *                junkFurnitureNote:
 *                  type: string
 *                computer:
 *                  type: boolean
 *                computerNote:
 *                  type: string
 *                errands:
 *                  type: boolean
 *                errandsNote:
 *                  type: string
 *                resourceID:
 *                  type: boolean
 *                resourceIDNote:
 *                  type: string
 *                other: 
 *                  type: boolean
 *                otherNote:
 *                  type: string
 *                serviceTimeNote:
 *                  type: string
 *    responses:
 *      200:
 *        description: A string of either Success or False
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
aidRouter.post('/applyForServices', function(req, res, next) {
    if (req.user) {
      try {
        base('Mutual Aid').select({sort: [{field: "Created Time", direction: "desc"}], filterByFormula: `AND({Username}='${req.user[0].fields.Username}', {Application Type}='Services Application')`}).firstPage((err, records) => {
          if (err) {
            console.log('Could not connect to Airtable');
            res.send("False");
          };
          if (records.length == 0 || records[0].fields.Service_Application_Status != "Pending") {
            const record_num = records.length + 1
            const app_id = "Services Application " + record_num.toString()
            base('Mutual Aid').create([
              {
                "fields": {
                  "Application_ID": app_id,
                  "Username": req.user[0].fields.Username,
                  "Application Type": "Services Application",
                  "Yard Work": req.body.state.yardWork,
                  "Yard Work Note": req.body.yardWorkNote,
                  "Car Maintenance": req.body.state.carMaintenance,
                  "Car Maintenance Note": req.body.carMaintenanceNote,
                  "Therapy": req.body.state.therapy,
                  "Therapy Note": req.body.therapyNote,
                  "Junk Removal": req.body.state.junkFurniture, 
                  "Junk Removal Note": req.body.junkFurnitureNote,
                  "Computer Literacy": req.body.state.computer, 
                  "Computer Literacy Note": req.body.computerNote,
                  "Errands/Transportation": req.body.state.errands, 
                  "Errands/Transportation Note": req.body.errandsNote,
                  "Resource Identification": req.body.state.resourceID,
                  "Resource Identification Note": req.body.resourceIDNote,
                  "Other Services Requested": req.body.state.other,
                  "Other Services Requested Note": req.body.otherNote,
                  "Service Requested Time Note": req.body.serviceTimeNote,
                  "Service_Application_Status": "Pending"
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
                  "Yard Work": req.body.state.yardWork,
                  "Yard Work Note": req.body.yardWorkNote,
                  "Car Maintenance": req.body.state.carMaintenance,
                  "Car Maintenance Note": req.body.carMaintenanceNote,
                  "Therapy": req.body.state.therapy,
                  "Therapy Note": req.body.therapyNote,
                  "Junk Removal": req.body.state.junkFurniture, 
                  "Junk Removal Note": req.body.junkFurnitureNote,
                  "Computer Literacy": req.body.state.computer, 
                  "Computer Literacy Note": req.body.computerNote,
                  "Errands/Transportation": req.body.state.errands, 
                  "Errands/Transportation Note": req.body.errandsNote,
                  "Resource Identification": req.body.state.resourceID,
                  "Resource Identification Note": req.body.resourceIDNote,
                  "Other Services Requested": req.body.state.other,
                  "Other Services Requested Note": req.body.otherNote,
                  "Service Requested Time Note": req.body.serviceTimeNote,
                }
              }
            ], function(err, updated_record) {
              if (err) {
                console.error(err)
                res.send("False")
              } else {;
                console.log("Application Updated")
                res.send("Success")
              }
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
 * /aid/applyForGoods:
 *  post:
 *    summary: Submit an application for goods
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
 *                clothes:
 *                  type: boolean
 *                clothesNote:
 *                  type: string
 *                furniture:
 *                  type: boolean
 *                furnitureNote:
 *                  type: string
 *                babyItems:
 *                  type: boolean
 *                babyItemsNote:
 *                  type: string
 *                bike:
 *                  type: boolean
 *                bikeNote:
 *                  type: string
 *                computer:
 *                  type: boolean
 *                computerNote:
 *                  type: string
 *                householdItems:
 *                  type: boolean
 *                householdItemsNote:
 *                  type: string
 *                mattressBed:
 *                  type: boolean
 *                mattressBedNote:
 *                  type: string
 *                food:
 *                  type: boolean
 *                repeatFood:
 *                  type: boolean
 *                other: 
 *                  type: boolean
 *                otherNote:
 *                  type: string
 *    responses:
 *      200:
 *        description: A string of either Success or False
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
  aidRouter.post('/applyForGoods', function(req, res, next) {
    if (req.user) {
      try {
        base('Mutual Aid').select({sort: [{field: "Created Time", direction: "desc"}], filterByFormula: `AND({Username}='${req.user[0].fields.Username}', {Application Type}='Goods Application')`}).firstPage((err, records) => {
          if (err) {
            console.log('Could not connect to Airtable');
            res.send("False");
          };
          if (records.length == 0 || records[0].fields.Goods_Application_Status != "Pending") {
            const record_num = records.length + 1
            const app_id = "Goods Application " + record_num.toString()
            base('Mutual Aid').create([
              {
                "fields": {
                  "Application_ID": app_id,
                  "Username": req.user[0].fields.Username,
                  "Application Type": "Goods Application",
                  "Clothes": req.body.state.clothes,
                  "Clothes Note": req.body.clothesNote,
                  "Furniture": req.body.state.furniture,
                  "Furniture Note": req.body.furnitureNote,
                  "Baby Items": req.body.state.babyItems,
                  "Baby Items Note": req.body.babyItemsNote,
                  "Bike": req.body.state.bike,
                  "Bike Note": req.body.bikeNote,
                  "Computer": req.body.state.computer, 
                  "Computer Note": req.body.computerNote,
                  "Household Items": req.body.state.householdItems, 
                  "Household Items Note": req.body.householdItemsNote,
                  "Mattress/Bed": req.body.state.mattressBed,
                  "Mattress/Bed Note": req.body.mattressBedNote,
                  "One Time Food Box": req.body.state.food,
                  "Repeating Food Box": req.body.state.repeatFood,
                  "Other Goods Requested": req.body.state.other,
                  "Other Goods Requested Note": req.body.otherNote,
                  "Goods_Application_Status": "Pending"
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
                  "Clothes": req.body.state.clothes,
                  "Clothes Note": req.body.clothesNote,
                  "Furniture": req.body.state.furniture,
                  "Furniture Note": req.body.furnitureNote,
                  "Baby Items": req.body.state.babyItems,
                  "Baby Items Note": req.body.babyItemsNote,
                  "Bike": req.body.state.bike,
                  "Bike Note": req.body.bikeNote,
                  "Computer": req.body.state.computer, 
                  "Computer Note": req.body.computerNote,
                  "Household Items": req.body.state.householdItems, 
                  "Household Items Note": req.body.householdItemsNote,
                  "Mattress/Bed": req.body.state.mattressBed,
                  "Mattress/Bed Note": req.body.mattressBedNote,
                  "One Time Food Box": req.body.state.food,
                  "Repeating Food Box": req.body.state.repeatFood,
                  "Other Goods Requested": req.body.state.other,
                  "Other Goods Requested Note": req.body.otherNote,
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
 * /aid/applyForFunds:
 *  post:
 *    summary: Submit an application for Funds
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
 *            fundingRequest:
 *              type: string
 *            paymentMethod:
 *              type: string
 *            paymentContext:
 *              type: string
 *            survey:
 *              type: boolean
 *    responses:
 *      200:
 *        description: A string of either Success or False
 *        content:
 *          - application/json:
 *              schema:
 *                type: string
 */
  aidRouter.post('/applyForFunds', function(req, res, next) {
    if (req.user) {
      try {
        base('Mutual Aid').select({sort: [{field: "Created Time", direction: "desc"}], filterByFormula: `AND({Username}='${req.user[0].fields.Username}', {Application Type}='Funds Application')`}).firstPage((err, records) => {
          if (err) {
            console.log('Could not connect to Airtable');
            res.send("False")
          };
          if (records.length == 0 || records[0].fields.Fund_Request_Status != "Pending") {
            const record_num = records.length + 1
            const app_id = "Funds Application " + record_num.toString()
            base('Mutual Aid').create([
              {
                "fields": {
                  "Application_ID": app_id,
                  "Username": req.user[0].fields.Username,
                  "Application Type": "Funds Application",
                  "Reason For Funds": req.body.fundingRequest,
                  "Payment Method": req.body.paymentMethod,
                  "Payment Context": req.body.paymentContext,
                  "Survey": req.body.survey,
                  "Fund_Request_Status": "Pending"
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
                  "Reason For Funds": req.body.fundingRequest,
                  "Payment Method": req.body.paymentMethod,
                  "Payment Context": req.body.paymentContext,
                  "Survey": req.body.survey,
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
      res.send("False")
    }
  })

  export default aidRouter;