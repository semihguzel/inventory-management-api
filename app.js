const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const connectToMongoDb = require("./middleware/database");

const productRouter = require("./routes/product-routes");
const warehouseRouter = require("./routes/warehouse-routes");

const HttpError = require("./utils/HttpError");

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");
  next();
});

app.use("/api/products", productRouter);
app.use("/api/warehouses", warehouseRouter);

app.use((req, res, next) => {
  const error = new HttpError("Could not find this route.", 404);
  throw error;
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  } else {
    res.status(error.code || 500).json({
      message: error.message || "An unknown error occured!",
    });
  }
});

connectToMongoDb()
  .then(() => {
    app.listen(4000);
  })
  .catch((err) => {
    console.log(err);
  });
