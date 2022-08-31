const { validationResult } = require("express-validator");

const HttpError = require("../utils/HttpError");

const WarehouseService = require("../services/warehouse-service");

const createWarehouseAction = async (req, res, next) => {
  let createdWarehouseId;

  const errors = validationResult(req);

  const { name, location } = req.body;

  const reqObject = { name, location };

  try {
    await WarehouseService.validateBeforeCreate(reqObject, errors);
  } catch (err) {
    return next(err);
  }

  try {
    createdWarehouseId = await WarehouseService.createWarehouse(reqObject);
  } catch (err) {
    return next(err);
  }

  res.status(201).json({ warehouseId: createdWarehouseId });
};

const updateWarehouseAction = async (req, res, next) => {
  const errors = validationResult(req);

  const id = req.params.wid;

  if (!errors.isEmpty() || !id)
    throw new HttpError("Invalid inputs passed, please check your data.", 422);

  const { name, location } = req.body;

  let warehouse;

  try {
    warehouse = await WarehouseService.updateWarehouse({ id, name, location });
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
