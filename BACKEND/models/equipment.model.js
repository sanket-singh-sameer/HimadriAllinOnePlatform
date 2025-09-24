import mongoose from "mongoose";

const equipmentSchema = new mongoose.Schema({
  object: { type: String, required: true },
  quantity: { type: Number, required: true, min: 0 },
  available: { type: Number, required: true, min: 0 },
  issuedHistory: [
    {
      issuedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      issuedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      status: { type: String, enum: ["issued", "returned"], default: "issued" },
      issuedOn: { type: Date, default: Date.now },
      returnedOn: { type: Date },
    },
  ],
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  addedOn: { type: Date, default: Date.now },
  updatedOn: { type: Date, default: Date.now },
});

const Equipment = mongoose.model("Equipment", equipmentSchema);

export default Equipment;
