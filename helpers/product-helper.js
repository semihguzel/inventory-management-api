const HttpError = require("../utils/HttpError");


const validateCreateObject = (productObj) => {
  if (
    productObj.name &&
    productObj.name.length > 0 &&
    productObj.description &&
    productObj.description.length > 0 &&
    productObj.warehouseId
  ) {
    return true;
  }
  return false;
};

const checkValidation = (productObj, errors) => {
  if (!errors.isEmpty() || !validateCreateObject(productObj))
    throw new HttpError("Invalid inputs passed, please check your data.", 422);
};



exports.validateCreateObject = validateCreateObject;
exports.checkValidation = checkValidation;

