const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const productSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  warehouse: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "Warehouse",
  },
});

module.exports = mongoose.model("Product", productSchema);
