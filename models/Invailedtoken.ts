import mongoose from "mongoose";

const invalidTokenSchema = new mongoose.Schema({
  token: {
    type: String,
    require: true,
  }
});

module.exports = mongoose.model("Token", invalidTokenSchema);
