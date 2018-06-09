// factory function
module.exports = function (pool) {
  var regNumber = "";
  var RegNumberMap = {};




  async function setReg(value) {
    // if (value !== "" && value.length > 0 && value.startsWith("CA ") || value.startsWith("CL") || value.startsWith("CAW") || value.startsWith("CJ")) {
    //   return false;
    // }
    var result = await pool.query('SELECT * FROM registrationNo WHERE reg_number=$1', [value]);
    console.log(result.rowCount)
    if (result.rowCount === 0) {
      let townTag = value.substring(0, 3).trim();
      console.log(townTag);
      let getid= await pool.query('SELECT id FROM towns WHERE town_tag=$1',[townTag]);
      await pool.query('INSERT INTO registrationNo (reg_number,town) VALUES ($1,$2)',[value,getid.rows[0].id]);
      
      return true;
    }
  }

  // getmap function
  async function getRegistrationMap() {
    let registration = await pool.query('SELECT reg_number fROM registrationNo');
    return registration.rows;
  }
  // get registration number
  async function getRegistationNumber() {

    return regNumber;
  }

  // filterby function
  async function filterBy(filterTown) {

    var regNums = Object.keys(RegNumberMap);
    if (filterTown === 'All') {
      return regNums;
    }
    var townFilter = regNums.filter(function (regNumber) {

      return regNumber.startsWith(filterTown)
    });

    return townFilter;
  }
  // get selected Town
  async function getSelectedTownList() {
    return tempTown;
  }

  async function clear() {
    let clear = RegNumberMap = {};
    return clear;
  }

  // returning all functions inside a factory function
  return {
    setRegistration: setReg,
    getMap: getRegistrationMap,
    getRegNumber: getRegistationNumber,
    filterTowns: filterBy,
    getListSelectedTown: getSelectedTownList,
    clear
  }
}
