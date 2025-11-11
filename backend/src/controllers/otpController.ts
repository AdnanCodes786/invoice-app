import { Request, Response } from "express";
import OTPModel from "../models/otpModel";
import UserModel from "../models/userModel";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const sendOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber } = req.body;
    console.log("📞 Received OTP request for:", phoneNumber);

    if (!phoneNumber) {
      console.warn("⚠️ Missing phoneNumber in request body");
      return res.status(400).json({ success: false, message: "Phone number is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    const otpDoc = await OTPModel.create({ phoneNumber, otp, expiresAt });

    console.table({
      phoneNumber,
      otp,
      expiresAt: expiresAt.toISOString(),
    });

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
      otp, // for testing
    });
  } catch (error) {
    console.error("❌ Error in sendOTP:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const verifyOTP = async (req: Request, res: Response) => {
  try {
    const { phoneNumber, otp } = req.body;
    console.log("🔍 Verifying OTP for:", phoneNumber);

    if (!phoneNumber || !otp) {
      return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
    }

    const record = await OTPModel.findOne({ phoneNumber }).sort({ createdAt: -1 });

    if (!record) {
      return res.status(404).json({ success: false, message: "OTP not found" });
    }

    if (record.verified) {
      return res.status(400).json({ success: false, message: "OTP already verified" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ success: false, message: "OTP expired" });
    }

    if (record.otp !== otp) {
      return res.status(400).json({ success: false, message: "Invalid OTP" });
    }

    record.verified = true;
    await record.save();

    // ✅ Safely handle user creation
    let user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      try {
        user = await UserModel.create({
          phoneNumber,
          companyDetails: {
            companyName: "",
            gstNumber: "",
            address: "",
            category: "",
          },
        });
        console.log("🆕 New user created:", user.phoneNumber);
      } catch (err: any) {
        console.error("❌ User creation failed:", err.message);
        return res.status(500).json({
          success: false,
          message: "User creation failed",
          error: err.message || "Validation error",
        });
      }
    }

    // ✅ Generate JWT token
    const token = jwt.sign({ phoneNumber: user.phoneNumber }, JWT_SECRET, { expiresIn: "2d" });

    console.log("🎟️ Token generated for:", user.phoneNumber);

    return res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      token,
      user,
    });
  } catch (error: any) {
    console.error("❌ Error in verifyOTP:", error.message);
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

