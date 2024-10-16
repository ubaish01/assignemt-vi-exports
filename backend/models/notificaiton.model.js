const mongoose = require("mongoose");
const notificationSchema = new mongoose.Schema(
  {
    views: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    content: {
      type: String,
      required: true,
    },
    tender: {
      type: mongoose.Types.ObjectId,
      ref: "Tender",
      required: true,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Notification", notificationSchema);
