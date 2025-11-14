import {Router} from "express";
import { verifyToken } from "../middlewares/authMiddleware";

const productsRouter = Router();


// productsRouter.post('/add-products',verifyToken,addProducts);