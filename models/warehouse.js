const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const warehouseSchema = new Schema({
  name: { type: String, required: true },
  location: { type: String, required: true },
  products: [{ type: mongoose.Types.ObjectId, required: true, ref: "Product" }],
});

module.exports = mongoose.model("Warehouse", warehouseSchema);
