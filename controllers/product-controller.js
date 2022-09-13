const { validationResult } = require("express-validator");
const ProductService = require("../services/product-service");
const ProductHelper = require("../helpers/product-helper");

const createProductAction = async (req, res, next) => {
  let createdProduct;

  const errors = validationResult(req);

  const { name, description, warehouseId } = req.body;

  const productObj = { name, description, warehouseId };

  try {
    ProductHelper.checkValidation(productObj, errors);
    await ProductService.checkIfExistsBeforeCreate(productObj);

    createdProduct = await ProductService.createProduct(productObj);
  } catch (err) {
    return next(err);
  }

  res.status(201).json({ product: createdProduct.toObject({ getters: true }) });
};

const updateProductAction = async (req, res, next) => {
  let updatedProduct;

  const errors = validationResult(req);

  const { name, description, warehouseId } = req.body;

  const productObj = { name, description, warehouseId };

  const productId = req.params.pid;

  try {
    ProductHelper.checkValidation(productObj, errors);
    await ProductService.getById(productId);

    updatedProduct = await ProductService.updateProduct(productId, productObj);
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ product: updatedProduct.toObject({ getters: true }) });
};

const deleteProductAction = async (req, res, next) => {
  const productId = req.params.pid;

  try {
    await ProductService.deleteProduct(productId);
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ message: "Product has been deleted." });
};

const getAllProductsAction = async (req, res, next) => {
  let productList;
  try {
    productList = await ProductService.getAllProducts({
      name: 1,
      description: 1,
      warehouse: 1,
    });
  } catch (err) {
    return next(err);
  }

  res.status(200).json({ items: productList });
};

exports.createProductAction = createProductAction;
exports.updateProductAction = updateProductAction;
exports.deleteProductAction = deleteProductAction;
exports.getAllProductsAction = getAllProductsAction;
