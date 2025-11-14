import { Schema, model, Document, Types } from "mongoose";

export interface IInvoiceItem extends Document {
  invoiceId: Types.ObjectId;
  productId: Types.ObjectId;

  quantity: number;
  unitPrice: number;

  taxRate: number;
  taxAmount: number;

  total: number;

  createdAt: Date;
  updatedAt: Date;
}

const InvoiceItemSchema = new Schema<IInvoiceItem>(
  {
    invoiceId: {
      type: Schema.Types.ObjectId,
      ref: "Invoice",
      required: true,
    },

    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
    },

    unitPrice: {
      type: Number,
      required: true,
    },

    taxRate: {
      type: Number,
      required: true,
    },

    taxAmount: {
      type: Number,
      required: true,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const InvoiceItemModel = model<IInvoiceItem>(
  "InvoiceItem",
  InvoiceItemSchema
);
