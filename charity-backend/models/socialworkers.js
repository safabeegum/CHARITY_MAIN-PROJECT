const Mongoose = require("mongoose");

const socialworkersSchema = Mongoose.Schema({
  org_name: String,
  email: String,
  address: String,
  phone: String,
  password: String,
});

const socialworkersModel = Mongoose.model("socialworkers", socialworkersSchema);
module.exports = socialworkersModel;
