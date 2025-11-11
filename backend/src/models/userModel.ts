import mongoose, { Document, Schema, Model } from "mongoose";

export interface CompanyDetails {
  companyName: string;
  gstNumber: string;
  address: string;
  category: string;
}

export interface IUser extends Document {
  phoneNumber: string;
  companyDetails: CompanyDetails;
}

const CompanyDetailsSchema = new Schema(
  {
    companyName: { type: String, required: false },
    gstNumber: { type: String, required: false },
    address: { type: String, required: false},
    category: { type: String, required: false },
  },
  { _id: false }
);

const UserSchema = new Schema<IUser>(
  {
    phoneNumber: { type: String, required: true, unique: true },
    companyDetails: { type: CompanyDetailsSchema, required: true },
  },
  { timestamps: true }
);

const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default UserModel;
