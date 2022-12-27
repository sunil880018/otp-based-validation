import { Schema, model } from "mongoose";
const OTPSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10 * 60, // 10 minutes
  },
});
const OTP = model("OTP", OTPSchema);
export { OTP };
