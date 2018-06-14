"Use strict";
var assert = require('assert');
const pg = require('pg');
const Pool = pg.Pool;

let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL 

const pool = new Pool({
    connectionString,
    ssl: useSSL
});
const Registration = require('../Registration_Numbers');

describe('The Add function for Registration Numbers', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM registrationNo');
  });
  it('should display "CA 123-009" if user entered CA 123-009 in a texfield of registration numbers', async function () {
    let registration = Registration(pool);
   await registration.setRegistration("CA 123-009");
    assert.deepEqual(await registration.getMap(), [{'reg_number':"CA 123-009"}]);
  });
   it('should display "CJ 123-243" if user entered CJ 123-243 in a texfield of registration numbers', async function () {
     let registration = Registration(pool);
    await  registration.setRegistration("CJ 123-243");
     assert.deepEqual(await registration.getMap(), [{'reg_number':"CJ 123-243"}]);
   });
   it('should display "CL 123-503" if user entered CL 123-503 in a texfield of registration numbers', async function () {
     let registration = Registration(pool);
     await registration.setRegistration("CL 123-503");
     assert.deepEqual(await registration.getMap(), [{'reg_number':"CL 123-503"}]);
   });
   it('should display "CAW 123-221" if user entered CAW 123-221 in a texfield of registration numbers', async function () {
     let registration = Registration(pool);
    await registration.setRegistration("CAW 123-221");
     assert.deepEqual( await registration.getMap(), [{'reg_number':"CAW 123-221"}]);
   });
});

describe('Stored registrarion numbers', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM registrationNo');
  });
  it('should display this object "[{}]" if user entered the following registration numbers CAW 123-356 and CA 123-356 ', async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CAW 123-356');
    await registration.setRegistration('CA 123-356');
    assert.deepEqual(await registration.getMap(), [{'reg_number':'CAW 123-356'},
   {'reg_number':'CA 123-356'}]);
  });
  it('should display one registration number in an object "[{}]" if user entered same registration number twice ', async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CAW 123-123');
    await registration.setRegistration('CAW 123-123');
    assert.deepEqual(await registration.getMap(), [{'reg_number':'CAW 123-123'}]);
  });
});

describe('Filter by Town function', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM registrationNo');
  });

  it("Should filter by CA and return all the registration numbers from Cape Town", async function () {
    let registration = Registration(pool);
      await registration.setRegistration('CL 123-234');
    await registration.setRegistration('CL 123-235');
    await registration.setRegistration('CA 123-235');
    let filterbyCA = await registration.filterTowns('CA');
    assert.deepEqual(filterbyCA, [{'reg_number':'CA 123-235',
    'town':1}]);
  });
  it("Should filter by CL and return all the registration numbers from Stellenbosh ", async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CL 123-234');
    await registration.setRegistration('CL 123-235');
    await registration.setRegistration('CA 123-235');
    let filterbyCL = await registration.filterTowns('CL');
    assert.deepEqual(filterbyCL, [{'reg_number':'CL 123-234',
    'town':2},{
      'reg_number':'CL 123-235','town':2
    }]);
  });
  it("Should filter by CJ and return all the registration numbers from Paarl", async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CJ 123-000');
    await registration.setRegistration('CJ 123-001');
    await registration.setRegistration('CL 123-001');
    let filterbyCJ = await registration.filterTowns('CJ');
    assert.deepEqual(filterbyCJ, [{'reg_number':'CJ 123-000','town':3},
  {'reg_number':'CJ 123-001','town':3}]);
  });

  it("Should filter by CAW and return all the registration numbers from  George", async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CAW 123-987');
    await registration.setRegistration('CJ 123-000');
    await registration.setRegistration('CJ 123-001');
    let filterbyCA = await registration.filterTowns('CAW');
    assert.deepEqual(filterbyCA, [{'reg_number':'CAW 123-987','town':4}]);
  });

  it("Should filter by All and return all the registration numbers ", async function () {
    let registration = Registration(pool);
    await registration.setRegistration('CAW 123-987');
    await registration.setRegistration('CJ 123-000');
    await registration.setRegistration('CJ 123-001');
    let filterbyCA = await registration.filterTowns('All');
    assert.deepEqual(filterbyCA, [{
      "reg_number": "CAW 123-987",
        "town": 4
      },
      {
        "reg_number": "CJ 123-000",
        "town": 3
      },
      {
        "reg_number": "CJ 123-001",
        "town": 3
      }]);
  });
});




describe('Clear function', function () {
  beforeEach(async function () {
    await pool.query('DELETE FROM registrationNo');
  });
  it('should clear all the stored registration numbers that are stored', async function () {
    let registration = Registration(pool);
    assert.deepEqual(await registration.clear(), []);
  })
  after(async function () {
    await pool.end();
  });
});