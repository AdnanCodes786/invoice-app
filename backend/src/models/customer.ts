import mongoose, { Schema, Document, Types, Model } from "mongoose";

export interface ICustomer extends Document {
  userId: Types.ObjectId;

  name: string;
  phoneNumber?: string;
  email?: string;

  billingAddress?: string;
  shippingAddress?: string;

  gstNumber?: string;
  businessName?: string;

  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomer>(
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

    phoneNumber: {
      type: String
    },

    email: {
      type: String
    },

    billingAddress: {
      type: String
    },

    shippingAddress: {
      type: String
    },

    gstNumber: {
      type: String
    },

    businessName: {
      type: String
    }
  },
  { timestamps: true }
);

export const CustomerModel: Model<ICustomer> =
  mongoose.models.Customer ||
  mongoose.model<ICustomer>("Customer", CustomerSchema);
