import { Request, Response } from "express";
import { ProductModel } from "../models/productModel";
import UserModel from "../models/userModel";

export async function createProduct(req: Request, res: Response) {
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
      categoryId,
      name,
      description,
      unit,
      purchasePrice,
      sellingPrice,
      taxRate,
      taxId,
      openingStock,
      currentStock,
      lowStockAlert,
      barcode,
    } = req.body;

    if (!name)
      return res
        .status(400)
        .json({ success: false, message: "Product name is required" });

    if (!unit)
      return res
        .status(400)
        .json({ success: false, message: "Unit is required" });

    if (purchasePrice === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Purchase price is required" });

    if (sellingPrice === undefined)
      return res
        .status(400)
        .json({ success: false, message: "Selling price is required" });

    const product = await ProductModel.create({
      userId: user._id,
      categoryId,
      name,
      description,
      unit,
      purchasePrice,
      sellingPrice,
      taxRate,
      taxId,
      openingStock: openingStock ?? 0,
      currentStock: currentStock ?? openingStock ?? 0,
      lowStockAlert: lowStockAlert ?? 5,
      barcode,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error in creating Product",
    });
  }
}
