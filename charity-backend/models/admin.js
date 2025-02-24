const Mongoose = require("mongoose")

const adminSchema = Mongoose.Schema(
    {
        email:String,
        username:String,
        password:String
    }
)

const adminModel = Mongoose.model("admin",adminSchema)
module.exports = adminModel