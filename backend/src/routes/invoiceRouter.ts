import { Router } from "express";
import { createInvoice } from "../controllers/invoiceController";
import { verifyToken } from "../middlewares/authMiddleware";


const InvoiceRouter = Router();

InvoiceRouter.post('/create-invoice',verifyToken,createInvoice);

export default InvoiceRouter;