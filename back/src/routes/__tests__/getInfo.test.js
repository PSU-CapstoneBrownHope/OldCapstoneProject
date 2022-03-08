const request = require("supertest");
const app = require("../../server");
jest.mock("airtable");
const airtable = require("airtable");

describe("getInfo Tests", () => {
  afterAll(() => {
    app.close();
  });
  it.skip("Valid user attempting to get info", async () => {
    const res = await request(app).post("/airtable/getInfo").send({
      userName: "testUser",
    });
    expect(res.statusCode).toEqual(200);
  });

  it.skip("Invalid user attempting to get info", async () => {
    airtable.prototype.firstPage = (callback) => {
      callback(null, []);
    };
    const res = await request(app).post("/airtable/getInfo").send({
      userName: "invalidName",
    });
    expect(res.statusCode).toEqual(401);
    expect(res.body.error).toEqual("No such user exists");
  });
});

app.close(); // Needed if skipping tests