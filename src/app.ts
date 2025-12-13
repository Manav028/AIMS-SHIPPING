import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import shippingRoutes from "./routes/shipping.routes";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", shippingRoutes);

export default app;