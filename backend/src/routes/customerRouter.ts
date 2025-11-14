import { Router } from "express";
import { createCustomer } from "../controllers/customerController";
import { verifyToken } from "../middlewares/authMiddleware";

const customerRouter = Router();

customerRouter.post('/create-customer',verifyToken, createCustomer);

export default customerRouter;
