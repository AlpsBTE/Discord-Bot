import mongoose = require("mongoose");

const suggestion = mongoose.model(
  "suggestion",
  new mongoose.Schema({
    id: { type: Number },
    userid: { type: String },
    messageid: { type: String },
    status: { type: String, default: "open" },
    opened: { type: Number, default: new Date().getTime() },
    closed: { type: Number, default: null },
  })
);

export default suggestion;
