const mongoose = require("mongoose");
const { Schema } = mongoose;

const permissionSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("Permission", permissionSchema);
