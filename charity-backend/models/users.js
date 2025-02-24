const Mongoose = require("mongoose")

const userSchema = Mongoose.Schema(
    {
        name:
        {
            type:String,
            required:true
        },
        username:
        {
            type:String,
            required:true
        },
        address:
        {
            type:String,
            required:true
        },
        email:
        {
            type:String,
            required:true
        },
        phone:
        {
            type:String,
            required:true
        },
        ward_no:
        {
            type:String,
            required:true,
            enum:['1','2','3','4','5','6','7','8','9','10']
        },
        ward_name:
        {
            type:String,
            required:true
        },
        password:
        {
            type:String,
            required:true
        }
        
    }
)

var userModel = Mongoose.model("users",userSchema)
module.exports = userModel