import mongoose from "mongoose";

const emergencyContactSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Contact name is required."],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },

    relationship: {
      type: String,
      required: [true, "Relationship is required."],
      trim: true,
      maxlength: 50,
    },

    phone: {
      type: String,
      required: [true, "Phone number is required."],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
      default: "",
    },

    isPrimary: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

emergencyContactSchema.index(
  {
    user: 1,
    phone: 1,
  },
  {
    unique: true,
  }
);

const EmergencyContact = mongoose.model(
  "EmergencyContact",
  emergencyContactSchema
);

export default EmergencyContact;