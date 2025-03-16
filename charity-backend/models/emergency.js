const Mongoose = require("mongoose");

const emergencySchema = new Mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  ward_no:
        {
            type:String,
            required:true,
            enum:['1','2','3','4','5','6','7','8','9','10']
        },
  alertType: { type: String, enum: ["Fire", "Flood", "Accident", "Crime", "Health", "Other"], required: true },
  reports: { type: Number, default: 0 }, // Users can like important alerts
  createdAt: { type: Date, default: Date.now },
});

const emergencyModel = Mongoose.model("emergency", emergencySchema);
module.exports = emergencyModel;
