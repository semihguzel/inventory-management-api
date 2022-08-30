const mongoose = require("mongoose");

const connectToMongoDb = () => {
  try {
    return mongoose.connect(
      "mongodb+srv://atlasAdmin:B9u2iBMEidyqbySy@cluster0.2xya0.mongodb.net/InventoryManagement?retryWrites=true&w=majority"
    );
  } catch (err) {
    console.log(err.message);
    throw new Error("Error when connecting to database.");
  }
};

module.exports = connectToMongoDb;
