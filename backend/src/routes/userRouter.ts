import { Router } from "express";
import { verifyToken } from "../middlewares/authMiddleware";
import { submitCompanyDetails } from "../controllers/userController";

const userRouter= Router();

userRouter.post("/submit-company", verifyToken, submitCompanyDetails);
userRouter.post("/submit-company", () => {});  // To save or update company details
userRouter.get("/profile", () => {});          // To fetch user profile

export default userRouter;
