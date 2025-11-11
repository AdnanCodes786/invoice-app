import mongoose, { Document, Schema } from "mongoose";

export interface IOTP extends Document {
  phoneNumber: string;
  otp: string;
  expiresAt: Date;
  verified: boolean;
}

const OTPSchema = new Schema<IOTP>(
  {
    phoneNumber: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema);
export default OTPModel;
