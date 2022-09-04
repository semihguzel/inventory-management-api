const express = require("express");

const checkAuth = require("../middleware/check-auth");
const productController = require("../controllers/product-controller");

const router = express.Router();

router.use(checkAuth);

router.post("/", productController.createProductAction);
router.patch("/:pid", productController.updateProductAction);
router.delete("/:pid", productController.deleteProductAction);

module.exports = router;
