const express = require("express");

const productController = require("../controllers/product-controller");

const router = express.Router();

router.post("/", productController.createProductAction);
router.patch("/:pid", productController.updateProductAction);
router.delete("/:pid", productController.deleteProductAction);

module.exports = router;
