const HttpError = require("../utils/HttpError");

const inputsAreValid = (warehouseObj) => {
  if (
    warehouseObj.name &&
    warehouseObj.name.length > 0 &&
    warehouseObj.location &&
    warehouseObj.location.length > 0
  ) {
    return true;
  }
  return false;
};

const checkValidation = async (warehouseObj, errors) => {
  if (!errors.isEmpty() || !inputsAreValid(warehouseObj))
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
};

exports.checkValidation = checkValidation;
exports.inputsAreValid = inputsAreValid;
