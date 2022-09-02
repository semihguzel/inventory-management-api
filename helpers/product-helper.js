const HttpError = require("../utils/HttpError");

const Product = require("../models/product");
const ProductService = require("../services/product-service");
const WarehouseHelper = require("../helpers/warehouse-helper");

const validateCreateObject = (productObj) => {
  if (
    productObj.name &&
    productObj.name.length > 0 &&
    productObj.description &&
    productObj.description.length > 0 &&
    productObj.image &&
    productObj.image.length > 0 &&
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

const checkIfExistsBeforeCreate = async (productObj) => {
  try {
    const doesExists = await ProductService.doesProductExists(productObj);

    if (doesExists) throw new HttpError("Data already exists.", 422);
  } catch (err) {
    throw err;
  }
};

const checkIfExists = async (productObj) => {
  try {
    const doesExists = await ProductService.doesProductExists(productObj);

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
    const product = await ProductService.getById(productId);

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
    createdProduct = await ProductService.createProduct(product, warehouse);
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
    updatedProduct = await ProductService.updateProduct(
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
    await ProductService.deleteProduct(productId, product, warehouse);
  } catch (err) {
    throw err;
  }
};

exports.validateCreateObject = validateCreateObject;
exports.checkValidation = checkValidation;
exports.checkIfExistsBeforeCreate = checkIfExistsBeforeCreate;
exports.checkIfExists = checkIfExists;
exports.getById = getById;
exports.createProduct = createProduct;
exports.updateProduct = updateProduct;
exports.deleteProduct = deleteProduct;
