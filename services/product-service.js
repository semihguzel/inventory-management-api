const Product = require("../models/product");
const ProductRepository = require("../repository/product-repository");
const WarehouseHelper = require("../helpers/warehouse-helper");
const HttpError = require("../utils/HttpError");

const checkIfExistsBeforeCreate = async (productObj) => {
  try {
    const doesExists = await ProductRepository.doesProductExists(productObj);

    if (doesExists) throw new HttpError("Data already exists.", 422);
  } catch (err) {
    throw err;
  }
};

const checkIfExists = async (productObj) => {
  try {
    const doesExists = await ProductRepository.doesProductExists(productObj);

    if (!doesExists)
      throw new HttpError(
        "Couldn't find product with given data, please check your data and try again.",
        422
      );
  } catch (err) {
    throw err;
  }
};

const getById = async (productId) => {
  try {
    const product = await ProductRepository.getById(productId);

    if (!product)
      throw new HttpError(
        "Couldn't find product with given data, please check your data and try again.",
        422
      );

    return product;
  } catch (err) {
    throw err;
  }
};

const createProduct = async (productObj) => {
  let createdProduct;

  const warehouse = await WarehouseHelper.getWarehouseById(
    productObj.warehouseId
  );

  const product = new Product({
    name: productObj.name,
    description: productObj.description,
    image: productObj.image,
    warehouse: productObj.warehouseId,
  });

  try {
    createdProduct = await ProductRepository.createProduct(product, warehouse);
  } catch (err) {
    console.log(err);
    throw err;
  }

  return createdProduct;
};

const updateProduct = async (productId, productObj) => {
  let updatedProduct;

  const warehouse = await WarehouseHelper.getWarehouseById(
    productObj.warehouseId
  );
  const product = await getById(productId);

  const oldWarehouse = await WarehouseHelper.getWarehouseById(
    product.warehouse
  );

  product.name = productObj.name;
  product.description = productObj.description;
  product.image = productObj.image;
  product.warehouse = productObj.warehouseId;

  try {
    updatedProduct = await ProductRepository.updateProduct(
      productId,
      product,
      warehouse,
      oldWarehouse
    );
  } catch (err) {
    console.log(err);
    throw err;
  }

  return updatedProduct;
};

const deleteProduct = async (productId) => {
  const product = await getById(productId);
  const warehouse = await WarehouseHelper.getWarehouseById(product.warehouse);

  try {
    await ProductRepository.deleteProduct(productId, product, warehouse);
  } catch (err) {
    throw err;
  }
};

exports.checkIfExistsBeforeCreate = checkIfExistsBeforeCreate;
exports.checkIfExists = checkIfExists;
exports.getById = getById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
