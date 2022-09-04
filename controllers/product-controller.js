const { validationResult } = require("express-validator");
const ProductService = require("../services/product-service");
const ProductHelper = require("../helpers/product-helper");
const HttpError = require("../utils/HttpError");

const createProductAction = async (req, res, next) => {
  let createdProduct;

  const errors = validationResult(req);

  const { name, description, image, warehouseId } = req.body;

  const productObj = { name, description, image, warehouseId };

  try {
    ProductHelper.checkValidation(productObj, errors);
    await ProductService.checkIfExistsBeforeCreate(productObj);

    createdProduct = await ProductService.createProduct(productObj);
  } catch (err) {
    return next(err);
  }

  res.status(202).json({ product: createdProduct.toObject({ getters: true }) });
};

const updateProductAction = async (req, res, next) => {
  let updatedProduct;

  const errors = validationResult(req);

  const { name, description, image, warehouseId } = req.body;

  const productObj = { name, description, image, warehouseId };

  const productId = req.params.pid;

  try {
    ProductHelper.checkValidation(productObj, errors);
    ProductService.checkIfExists(productObj);

    updatedProduct = await ProductService.updateProduct(productId, productObj);
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ product: updatedProduct.toObject({ getters: true }) });
};

const deleteProductAction = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty())
    throw new HttpError("Invalid inputs passed, please check your data.", 422);

  const productId = req.params.pid;

  try {
    await ProductService.deleteProduct(productId);
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ message: "Product has been deleted." });
};

exports.createProductAction = createProductAction;
exports.updateProductAction = updateProductAction;
exports.deleteProductAction = deleteProductAction;
