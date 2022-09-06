const Product = require("../models/product");

const HttpError = require("../utils/HttpError");

const { default: mongoose } = require("mongoose");

const doesProductExists = async (productObj) => {
  try {
    return await Product.exists(productObj);
  } catch (err) {
    return new HttpError(
      "There has been an error when creating data, please try again.",
      500
    );
  }
};

const getById = async (productId) => {
  try {
    const product = Product.findById(productId);

    return product;
  } catch (err) {
    throw new HttpError(
      "Couldn't find product with given data, please check your data and try again.",
      422
    );
  }
};

const createProduct = async (product, warehouse) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await product.save({ session });
    warehouse.products.push(product);
    await warehouse.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    throw new HttpError(
      "There has been an error when creating data, please try again",
      500
    );
  }

  return product;
};

const updateProduct = async (productId, product, warehouse, oldWarehouse) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await product.save({ session });
    oldWarehouse.products.pull(productId);
    warehouse.products.push(product);
    await warehouse.save({ session });
    await oldWarehouse.save({ session });
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    throw new HttpError(
      "There has been an error when updating data, please try again",
      500
    );
  }

  return product;
};

const deleteProduct = async (productId, product, warehouse) => {
  try {
    const session = await mongoose.startSession();
    session.startTransaction();
    await product.remove({ session });
    warehouse.products.pull(productId);
    await warehouse.save();
    await session.commitTransaction();
  } catch (err) {
    console.log(err);
    throw new HttpError(
      "There has been an error when deleting data, please try again",
      500
    );
  }
};

const getAllProducts = async (selectColumnsObj = null) => {
  try {
    return selectColumnsObj
      ? await Product.find({})
          .populate("warehouse", "name -_id")
          .select(selectColumnsObj)
      : Product.find({});
  } catch (err) {
    throw new HttpError("Couldn't get products, please try again later", 500);
  }
};

exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
exports.doesProductExists = doesProductExists;
exports.getById = getById;
exports.getAllProducts = getAllProducts;
