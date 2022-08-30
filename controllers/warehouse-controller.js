const { validationResult } = require("express-validator");

const HttpError = require("../utils/HttpError");

const Warehouse = require("../models/warehouse");

const WarehouseService = require("../services/warehouse-service");

const createWarehouse = async (req, res, next) => {
  const errors = validationResult(req);

  const { name, location } = req.body;

  try {
    await WarehouseService.validateBeforeCreate({ name, location }, errors);
  } catch (err) {
    return next(err);
  }

  const createdWarehouse = new Warehouse({
    name,
    location,
  });

  try {
    await createdWarehouse.save();
  } catch (err) {
    return next(
      new HttpError(
        "There has been an error when creating data, please try again",
        500
      )
    );
  }

  res.status(201).json({ warehouseId: createdWarehouse.id });
};

const updateWarehouse = async (req, res, next) => {
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

const deleteWarehouse = async (req, res, next) => {
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

exports.createWarehouse = createWarehouse;
exports.updateWarehouse = updateWarehouse;
exports.deleteWarehouse = deleteWarehouse;
