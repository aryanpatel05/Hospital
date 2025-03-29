// backend/models/Face_collection.js
const mongoose = require("mongoose");

const faceCollectionSchema = new mongoose.Schema({
  // Reference to the patient document (_id from User_details)
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_details",
    required: true,
  },
  // Store the face image as a base64 string (or a file path if preferred)
  face_image: { type: String, required: true },
});

module.exports = mongoose.model(
  "Face_collection",
  faceCollectionSchema,
  "Face_collection"
);
