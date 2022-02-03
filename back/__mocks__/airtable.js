const db = [
  {
    id: 1,
    getId: () => {
      return 1;
    },
    fields: {
      Name: "Test User",
      Email: "fakeEmail@email",
      Phone: "987-654-3210",
      "Delivery Addresss": "4561 FakeSt",
      "Funding Type": "check",
      Users: "testUser",
    },
  },
];

//Airtable is complicated so we need to extend function catch the invokable object
//behavior, see: https://stackoverflow.com/questions/36871299/how-to-extend-function-with-es6-classes
class ExFunc extends Function {
  constructor() {
    super("...args", "return this.__self__.__call__(...args)");
    var self = this.bind(this);
    this.__self__ = self;
    return self;
  }

  __call__(a, b, c) {
    return [a, b, c];
  }
}

class MockAirtable extends ExFunc {
  __call__(arg) {
    return this;
  }
  base(arg) {
    return this;
  }

  select(arg) {
    for (const entry in db) {
      if (entry.Name === arg) return entry.id;
    }
    return this;
  }

  find(arg, callback) {
    for (const entry in db) {
      if (entry.id === arg) return entry;
    }
    const err = null;
    const record = null;
    if (arg === db[0].id) {
      callback(err, db[0]);
    } else {
      callback(err, record);
    }
  }

  firstPage(callback) {
    const err = null;
    callback(err, db);
  }

  update(id, fields, callback) {
    return new Promise((resolve, reject) => {
      if (id !== 1)
        return reject({
          toString: () => {
            return "Invalid syntax";
          },
        });
    //   for (const field in fields) {
    //     switch (field) {
    //       case "address":
    //         db[0]["Delivery Address"] = fields[field];
    //         break;
    //       case "Name":
    //         db[0].Name = fields[field];
    //         break;
    //       case "phoneNumber":
    //         db[0].Phone = fields[field];
    //         break;
    //       case "emailAddress":
    //         db[0].Email = fields[field];
    //         break;
    //       case "paymentMethod":
    //         db[0]["Funding Type"] = fields[field];
    //         break;
    //     }
    //   }
      return resolve(db[0]);
    });
  }
}

module.exports = MockAirtable;
