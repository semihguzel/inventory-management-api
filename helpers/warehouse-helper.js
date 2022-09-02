const Warehouse = require("../models/warehouse");
const WarehouseService = require("../services/warehouse-service");

const HttpError = require("../utils/HttpError");

const validateAndFind = async (warehouseObj) => {
  if (!inputsAreValid(warehouseObj))
    throw new HttpError("Invalid inputs passed, please check your data.", 422);

  let warehouse;
  try {
    warehouse = await findWarehouseById(warehouseObj.id);
  } catch (err) {
    throw err;
  }

  if (!warehouse) {
    throw new HttpError("Data does not exists. Please check your data", 422);
  }

  return warehouse;
};

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

const doesWarehouseExistsForCreate = async (warehouseObj) => {
  try {
    return await Warehouse.exists(warehouseObj);
  } catch (err) {
    throw new HttpError(
      "There has been an error when creating data, please try again",
      500
    );
  }
};

const findWarehouseById = async (id) => {
  try {
    const warehouse = await Warehouse.findById(id);

    if (!warehouse) throw new Error();

    return warehouse;
  } catch (err) {
    throw new HttpError(
      "There has been an error when finding data, please check sent id or try again",
      500
    );
  }
};

const getWarehouseById = async (id) => {
  let warehouse;

  try {
    warehouse = await WarehouseService.getById(id);
  } catch (err) {
    throw err;
  }

  return warehouse;
};

exports.validateAndFind = validateAndFind;
exports.inputsAreValid = inputsAreValid;
exports.doesWarehouseExistsForCreate = doesWarehouseExistsForCreate;
exports.findWarehouseById = findWarehouseById;
exports.getWarehouseById = getWarehouseById;
