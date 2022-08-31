const HttpError = require("../utils/HttpError");

const Warehouse = require("../models/warehouse");
const WarehouseHelper = require("../helpers/warehouse-helper");

const updateWarehouse = async (warehouseEntity) => {
  try {
    const warehouse = await WarehouseHelper.validateAndFind(warehouseEntity);

    warehouse.name = warehouseEntity.name;
    warehouse.location = warehouseEntity.location;

    await warehouse.save();

    return warehouse;
  } catch (err) {
    throw new HttpError(
      "There has been an error when updating data, please try again",
      500
    );
  }
};

const deleteWarehouse = async (warehouseId) => {
  try {
    const warehouse = await WarehouseHelper.findWarehouseById(warehouseId);

    warehouse.delete();
  } catch (err) {
    if (err.code) throw err;

    throw new HttpError(
      "There has been an error when deleting data, please try again",
      500
    );
  }
};

const createWarehouse = async (warehouseObj) => {
  const createdWarehouse = new Warehouse({
    name: warehouseObj.name,
    location: warehouseObj.location,
  });

  try {
    await createdWarehouse.save();
  } catch (err) {
    throw new HttpError(
      "There has been an error when creating data, please try again",
      500
    );
  }

  return createdWarehouse.id;
};

const validateBeforeCreate = async (warehouseObj, errors) => {
  if (!errors.isEmpty() || !WarehouseHelper.inputsAreValid(warehouseObj))
    throw new HttpError("Invalid inputs passed, please check your data.", 422);

  let doesItemExists;
  try {
    doesItemExists = await WarehouseHelper.doesWarehouseExistsForCreate(
      warehouseObj
    );
  } catch (err) {
    throw err;
  }

  if (doesItemExists) {
    throw new HttpError("Data already exists.", 422);
  }
};

exports.validateBeforeCreate = validateBeforeCreate;
exports.updateWarehouse = updateWarehouse;
exports.deleteWarehouse = deleteWarehouse;
exports.createWarehouse = createWarehouse;
