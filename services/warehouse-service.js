const HttpError = require("../utils/HttpError");

const Warehouse = require("../models/warehouse");
const WarehouseRepository = require("../repository/warehouse-repository");
const WarehouseHelper = require("../helpers/warehouse-helper");

const createWarehouse = async (warehouseObj) => {
  let createdWarehouse;

  const warehouse = new Warehouse({
    name: warehouseObj.name,
    location: warehouseObj.location,
    products: [],
  });

  try {
    createdWarehouse = await WarehouseRepository.createWarehouse(warehouse);
  } catch (err) {
    throw new HttpError(
      "There has been an error when creating data, please try again",
      500
    );
  }

  return createdWarehouse;
};

const updateWarehouse = async (warehouseId, warehouseEntity) => {
  let updatedWarehouse;
  try {
    const warehouse = await WarehouseRepository.getById(warehouseId);

    warehouse.name = warehouseEntity.name;
    warehouse.location = warehouseEntity.location;

    updatedWarehouse = await WarehouseRepository.updateWarehouse(warehouse);

    return updatedWarehouse;
  } catch (err) {
    throw new HttpError(
      "There has been an error when updating data, please try again",
      500
    );
  }
};

const deleteWarehouse = async (warehouseId) => {
  try {
    const warehouse = await WarehouseRepository.getById(warehouseId);

    await WarehouseRepository.deleteWarehouse(warehouse);
  } catch (err) {
    if (err.code) throw err;

    throw new HttpError(
      "There has been an error when deleting data, please try again",
      500
    );
  }
};

const validateBeforeCreate = async (warehouseObj, errors) => {
  if (!errors.isEmpty() || !WarehouseHelper.inputsAreValid(warehouseObj))
    throw new HttpError("Invalid inputs passed, please check your data.", 422);

  let doesItemExists;
  try {
    doesItemExists = await WarehouseRepository.doesWarehouseExistsForCreate(
      warehouseObj
    );
  } catch (err) {
    throw err;
  }

  if (doesItemExists) {
    throw new HttpError("Data already exists.", 422);
  }
};

const getAll = async (selectColumnsObj = null) => {
  try {
    return await WarehouseRepository.getAll(selectColumnsObj);
  } catch (err) {
    throw err;
  }
};

exports.validateBeforeCreate = validateBeforeCreate;
exports.updateWarehouse = updateWarehouse;
exports.deleteWarehouse = deleteWarehouse;
exports.createWarehouse = createWarehouse;
exports.getAll = getAll;
