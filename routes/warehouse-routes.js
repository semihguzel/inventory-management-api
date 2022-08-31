const express = require("express");

const warehouseController = require("../controllers/warehouse-controller");

const router = express.Router();

router.post("/", warehouseController.createWarehouseAction);
router.patch("/:wid", warehouseController.updateWarehouseAction);
router.delete("/:wid", warehouseController.deleteWarehouseAction);

module.exports = router;
