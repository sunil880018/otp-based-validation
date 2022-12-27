import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail.js";
const UserSchema = new Schema({
  name: {
    type: String,
    required: [true, "User must have a name"],
    trim: true,
  },
  email: {
    type: String,
    validate: [isEmail, "invalid email"],
    required: [true, "User must have an email"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const User = model("User", UserSchema);
export { User };
