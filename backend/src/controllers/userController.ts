import { Request, Response } from "express";
import UserModel from "../models/userModel";

export const submitCompanyDetails = async (req: Request, res: Response) => {
  try {
    const { companyName, gstNumber, address, category } = req.body;

    if (!req.user || !req.user.phoneNumber) {
      return res.status(401).json({ success: false, message: "Unauthorized: Invalid token" });
    }

    const phoneNumber = req.user.phoneNumber;

    // Validate required fields
    if (!companyName || !gstNumber || !address || !category) {
      return res.status(400).json({ success: false, message: "All company fields are required" });
    }

    // Update or create if user not found
    const updatedUser = await UserModel.findOneAndUpdate(
      { phoneNumber },
      {
        $set: {
          companyDetails: {
            companyName,
            gstNumber,
            address,
            category,
          },
        },
      },
      { new: true, upsert: true }
    );

    console.log("🏢 Company details updated for:", phoneNumber);

    return res.status(200).json({
      success: true,
      message: "Company details submitted successfully",
      user: updatedUser,
    });
  } catch (error: any) {
    console.error("❌ Error in submitCompanyDetails:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
