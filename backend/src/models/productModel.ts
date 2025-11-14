import { Schema, model, Document, Types } from "mongoose";

export interface IProduct extends Document {
  userId: Types.ObjectId;
  categoryId?: Types.ObjectId;

  name: string;
  description?: string;

  unit: string;

  purchasePrice: number;
  sellingPrice: number;

  taxRate?: number;
  taxId?: Types.ObjectId;

  openingStock?: number;
  currentStock?: number;
  lowStockAlert?: number;

  barcode?: string;

  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: false,
    },

    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },

    unit: {
      type: String,
      required: true,
      default: "pcs",
    },

    purchasePrice: {
      type: Number,
      required: true,
    },

    sellingPrice: {
      type: Number,
      required: true,
    },

    taxRate: {
      type: Number,
      required: false,
    },

    taxId: {
      type: Schema.Types.ObjectId,
      ref: "Tax",
      required: false,
    },

    openingStock: {
      type: Number,
      required: false,
      default: 0,
    },

    currentStock: {
      type: Number,
      required: false,
      default: 0,
    },

    lowStockAlert: {
      type: Number,
      required: false,
      default: 5,
    },

    barcode: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const ProductModel = model<IProduct>("Product", ProductSchema);
