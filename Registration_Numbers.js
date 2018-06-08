// factory function
module.exports=function(storedRegNumbers) {
  var regNumber = "";
  var RegNumberMap = {};

  if (storedRegNumbers) {
    for (var i = 0; i < storedRegNumbers.length; i++) {
      let regStored = storedRegNumbers[i];
      RegNumberMap[regStored] = 0;
    }
  }


  function setReg(value) {
    if (RegNumberMap[value] === undefined) {
      if (value !== "" && value.length > 0 && value.startsWith("CA") || value.startsWith("CL") || value.startsWith("CAW") || value.startsWith("CJ")) {
        regNumber = value;
        RegNumberMap[regNumber] = 0;

        return true;
      }
      return false;

    }
  }


    // getmap function
    function getRegistrationMap(storedRegNumbers) {
      return Object.keys(RegNumberMap);
    }
    // get registration number
    function getRegistationNumber() {
      return regNumber;
    }
    //   creaate an Element
    function createItems(reg) {
      var li = document.createElement("li");
      li.className = 'regPlate';
      li.textContent = reg;
      displayReg.appendChild(li);
    }
    // filterby function
    function filterBy(filterTown) {

      var regNums = Object.keys(RegNumberMap);
      if (filterTown === '') {
        return regNums;
      }
      var townFilter = regNums.filter(function(regNumber) {

        return regNumber.startsWith(filterTown)
      });
   
      return townFilter;
    }
    // get selected Town
    function getSelectedTownList() {
      return tempTown;
    }
   
    function clear(){
     let clear= RegNumberMap ={} ;
      return clear ;
    }

    // returning all functions inside a factory function
    return {
      setRegistration: setReg,
      getMap: getRegistrationMap,
      getRegNumber: getRegistationNumber,
      filterTowns: filterBy,
      createLi: createItems,
      getListSelectedTown: getSelectedTownList,
      clear
    }
  }
