import express, { Request, Response } from "express";
import dotenv from "dotenv";
import connectDB from "./db/connect";
import otpRouter from "./routes/otpRouter";
import userRouter from "./routes/userRouter";
import productsRouter from "./routes/productRoute";
import customerRouter from "./routes/customerRouter";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.json());
app.use(express.json());
connectDB();


app.use("/otp", otpRouter);
app.use("/user", userRouter);
app.use("/product", productsRouter);
app.use("/customer", customerRouter);

app.get("/", (req: Request, res: Response) => {
  res.send("Server is running 🚀");
});

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
