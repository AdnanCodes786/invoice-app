import { Request, Response } from "express";

import UserModel from "../models/userModel";
import { InvoiceItemModel } from "../models/invoiceItem";
import { ProductModel } from "../models/productModel";
import { InvoiceModel } from "../models/invoiceModel";

export async function createInvoice(req: Request, res: Response) {
  try {
    
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const phoneNumber = req.user.phoneNumber;
    if (!phoneNumber) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const user = await UserModel.findOne({ phoneNumber });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "User not found" });
    }

    const {
      customerId,
      invoiceDate,
      dueDate,
      items,
      discount = 0,
      paidAmount = 0,
      paymentMethod = "NONE",
      notes,
    } = req.body;

    // Required fields check
    if (!customerId) {
      return res
        .status(400)
        .json({ success: false, message: "customerId is required" });
    }
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "At least one item is required" });
    }
    if (!invoiceDate) {
      return res
        .status(400)
        .json({ success: false, message: "invoiceDate is required" });
    }


    async function generateInvoiceNumber() {
      while (true) {
        const randomNumber = Math.floor(1000 + Math.random() * 9000); // 4 digits
        const invoiceNumber = `INV-${randomNumber}`;

        const exists = await InvoiceModel.findOne({ invoiceNumber });
        if (!exists) return invoiceNumber;
      }
    }

    const invoiceNumber = generateInvoiceNumber();

    let subtotal = 0;
    let totalTax = 0;

    const itemList: any[] = [];

    for (const item of items) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Invalid productId: ${item.productId}`,
        });
      }

      const quantity = item.quantity || 1;
      const unitPrice = product.sellingPrice;
      const taxRate = item.taxRate || product.taxRate || 0;

      const itemSubtotal = quantity * unitPrice;
      const taxAmount = (itemSubtotal * taxRate) / 100;
      const total = itemSubtotal + taxAmount;

      subtotal += itemSubtotal;
      totalTax += taxAmount;

      itemList.push({
        invoiceId: "",
        productId: product._id,
        quantity,
        unitPrice,
        taxRate,
        taxAmount,
        total,
      });
    }

    // -------------------------------------------
    // 5. Final Total Calculations
    // -------------------------------------------
    const finalSubtotalAfterDiscount = subtotal - discount;
    const totalAmount = finalSubtotalAfterDiscount + totalTax;

    const balanceAmount = totalAmount - paidAmount;

    let status: "PAID" | "UNPAID" | "PARTIAL" = "UNPAID";
    if (paidAmount >= totalAmount) status = "PAID";
    else if (paidAmount > 0) status = "PARTIAL";

    // -------------------------------------------
    // 6. Create Invoice Document
    // -------------------------------------------
    const invoice = await InvoiceItemModel.create({
      userId: user._id,
      customerId,
      invoiceNumber,
      invoiceDate,
      dueDate,

      subtotal,
      taxAmount: totalTax,
      discount,
      totalAmount,

      paidAmount,
      balanceAmount,
      status,
      paymentMethod,
      notes,
    });

    const itemsToInsert = itemList.map((i) => ({
      ...i,
      invoiceId: invoice._id,
    }));

    await InvoiceItemModel.insertMany(itemsToInsert);

    // -------------------------------------------
    // 8. Return Response
    // -------------------------------------------
    return res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      invoice,
      items: itemsToInsert,
    });
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "Error creating invoice",
    });
  }
}
