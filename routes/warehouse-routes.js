const express = require("express");

const checkAuth = require("../middleware/check-auth");
const warehouseController = require("../controllers/warehouse-controller");

const router = express.Router();

router.get("/", warehouseController.getAllAction);

router.use(checkAuth);

router.post("/", warehouseController.createWarehouseAction);
router.patch("/:wid", warehouseController.updateWarehouseAction);
router.delete("/:wid", warehouseController.deleteWarehouseAction);

module.exports = router;
