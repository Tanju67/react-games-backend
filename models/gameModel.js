const mongoose = require("mongoose");
const GameSchema = new mongoose.Schema({
  highscore: {
    type: Number,
    required: true,
  },
  createdBy: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

module.exports = mongoose.model("Game", GameSchema);
