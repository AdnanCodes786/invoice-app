import "express";

declare global {
  namespace Express {
    interface Request {
      user?: {
        phoneNumber: string;
        [key: string]: any;
      };
    }
  }
}
