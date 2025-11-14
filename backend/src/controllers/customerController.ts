import { Request, Response } from "express";
import UserModel from "../models/userModel";
import { CustomerModel } from "../models/customer";

export async function createCustomer(req: Request, res: Response) {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const phoneNumber = req.user.phoneNumber;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    
    const {
      name,
      phoneNumber: customerPhone,
      email,
      billingAddress,
      shippingAddress,
      gstNumber,
      businessName,
    } = req.body;

    // -----------------------------------
    // 4. Validate required fields
    // -----------------------------------
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Customer name is required",
      });
    }

    // -----------------------------------
    // 5. Create the customer
    // -----------------------------------
    const customer = await CustomerModel.create({
      userId: user._id,
      name,
      phoneNumber: customerPhone,
      email,
      billingAddress,
      shippingAddress,
      gstNumber,
      businessName,
    });

    return res.status(201).json({
      success: true,
      message: "Customer created successfully",
      customer,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating customer",
    });
  }
}
