import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import shippingRoutes from "./routes/shipping.routes";
import uploadRoutes from "./routes/upload.routes"

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", shippingRoutes);
app.use("/api", uploadRoutes);

export default app;