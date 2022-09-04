const { validationResult } = require("express-validator");

const HttpError = require("../utils/HttpError");

const WarehouseService = require("../services/warehouse-service");
const WarehouseHelper = require("../helpers/warehouse-helper");

const createWarehouseAction = async (req, res, next) => {
  let createdWarehouse;

  const errors = validationResult(req);

  const { name, location } = req.body;

  const warehouseObj = { name, location };

  try {
    WarehouseHelper.checkValidation(warehouseObj, errors);
    await WarehouseService.validateBeforeCreate(warehouseObj, errors);

    createdWarehouse = await WarehouseService.createWarehouse(warehouseObj);
  } catch (err) {
    return next(err);
  }
  res
    .status(201)
    .json({ product: createdWarehouse.toObject({ getters: true }) });
};

const updateWarehouseAction = async (req, res, next) => {
  const errors = validationResult(req);

  const id = req.params.wid;

  const { name, location } = req.body;

  const warehouseObj = { name, location };

  let warehouse;

  try {
    WarehouseHelper.checkValidation(warehouseObj, errors);
    warehouse = await WarehouseService.updateWarehouse(id, warehouseObj);
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ warehouse: warehouse.toObject({ getters: true }) });
};

const deleteWarehouseAction = async (req, res, next) => {
  const id = req.params.wid;

  if (!id)
    throw new HttpError("Invalid id passed, please check your data.", 422);

  try {
    await WarehouseService.deleteWarehouse(id);
  } catch (err) {
    return next(err);
  }
  res.status(200).json({ message: "Warehouse deleted." });
};

exports.createWarehouseAction = createWarehouseAction;
exports.updateWarehouseAction = updateWarehouseAction;
exports.deleteWarehouseAction = deleteWarehouseAction;
