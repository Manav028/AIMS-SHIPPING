import express from "express";
import cors from "cors";
import shippingRoutes from "./routes/shipping.routes";

const app = express();
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.use("/api", shippingRoutes);

export default app;