import { Schema, model, Document, Types } from "mongoose";

// ---------------- ENUMS ---------------- //
export enum InvoiceStatus {
  PAID = "PAID",
  UNPAID = "UNPAID",
  PARTIAL = "PARTIAL",
}

export enum PaymentMethod {
  CASH = "CASH",
  UPI = "UPI",
  BANK = "BANK",
  NONE = "NONE",
}

// ---------------- INTERFACE ---------------- //
export interface IInvoice extends Document {
  userId: Types.ObjectId;
  customerId: Types.ObjectId;
  invoiceNumber: string;

  invoiceDate: Date;
  dueDate?: Date;

  subtotal: number;
  taxAmount: number;
  discount?: number;
  totalAmount: number;

  paidAmount: number;
  balanceAmount: number;

  status: InvoiceStatus;
  paymentMethod: PaymentMethod;

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}

// ---------------- SCHEMA ---------------- //
const InvoiceSchema = new Schema<IInvoice>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },

    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },

    invoiceDate: {
      type: Date,
      required: true,
    },

    dueDate: {
      type: Date,
      required: false,
    },

    subtotal: {
      type: Number,
      required: true,
    },

    taxAmount: {
      type: Number,
      required: true,
    },

    discount: {
      type: Number,
      required: false,
      default: 0,
    },

    totalAmount: {
      type: Number,
      required: true,
    },

    paidAmount: {
      type: Number,
      required: true,
      default: 0,
    },

    balanceAmount: {
      type: Number,
      required: true,
    },

    status: {
      type: String,
      enum: Object.values(InvoiceStatus),
      default: InvoiceStatus.UNPAID,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: PaymentMethod.NONE,
    },

    notes: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

export const InvoiceModel = model<IInvoice>("Invoice", InvoiceSchema);
