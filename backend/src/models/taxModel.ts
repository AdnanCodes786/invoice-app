import { Schema, model, Document,Types } from "mongoose";

export enum TaxType {
  GST = "GST",
  CGST = "CGST",
  SGST = "SGST",
  IGST = "IGST",
  VAT = "VAT",
  SERVICE_TAX = "SERVICE_TAX",
  CUSTOM_TAX = "CUSTOM_TAX",
  NONE = "NONE"
}

export interface ITax extends Document {
  userId: Types.ObjectId;
  name: string;
  type: TaxType;
  percentage: number;
  isCompound: boolean;
  isInclusive: boolean;
  hsnCode?: string;
  description?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TaxSchema = new Schema<ITax>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    name: {
      type: String,
      required: true
    },

    type: {
      type: String,
      enum: Object.values(TaxType),
      default: TaxType.GST
    },

    percentage: {
      type: Number,
      required: true
    },

    isCompound: {
      type: Boolean,
      default: false
    },

    isInclusive: {
      type: Boolean,
      default: false
    },

    hsnCode: {
      type: String
    },

    description: {
      type: String
    },

    isActive: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

export const TaxModel = model<ITax>("Tax", TaxSchema);
