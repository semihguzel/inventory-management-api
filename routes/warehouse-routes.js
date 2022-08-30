const express = require("express");

const warehouseController = require("../controllers/warehouse-controller");

const router = express.Router();

router.post("/", warehouseController.createWarehouse);
router.patch("/:wid", warehouseController.updateWarehouse);
router.delete("/:wid", warehouseController.deleteWarehouse);

module.exports = router;
