import {Router} from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { createProduct } from "../controllers/productController";

const productsRouter = Router();


productsRouter.post('/add-products',verifyToken,createProduct);


export default productsRouter;