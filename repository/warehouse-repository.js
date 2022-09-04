const Warehouse = require("../models/warehouse");

const getById = async (id) => {
  try {
    const warehouse = await Warehouse.findById(id);

    if (!warehouse)
      throw new HttpError(
        "Couldn't find warehouse with given data, please check your data and try again.",
        422
      );

    return warehouse;
  } catch (err) {
    throw new HttpError(
      "There has been an error when finding data, please check sent id or try again",
      500
    );
  }
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

const updateWarehouse = async (warehouse) => {
  try {
    await warehouse.save();

    return warehouse;
  } catch (err) {
    throw new HttpError(
      "There has been an error when updating data, please try again",
      500
    );
  }
};

const deleteWarehouse = async (warehouse) => {
  try {
    warehouse.delete();
  } catch (err) {
    if (err.code) throw err;

    throw new HttpError(
      "There has been an error when deleting data, please try again",
      500
    );
  }
};

const createWarehouse = async (warehouse) => {
  try {
    await warehouse.save();
  } catch (err) {
    throw new HttpError(
      "There has been an error when creating data, please try again",
      500
    );
  }

  return warehouse;
};

exports.doesWarehouseExistsForCreate = doesWarehouseExistsForCreate;
exports.getById = getById;
exports.updateWarehouse = updateWarehouse;
exports.deleteWarehouse = deleteWarehouse;
exports.createWarehouse = createWarehouse;
