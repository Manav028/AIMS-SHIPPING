import express from "express";
import { shippingController } from "../controllers/shipping.controller";
import { apiKeyAuth } from "../middleware/apiKeyAuth";

const router = express.Router();

router.post("/UserAvailableServices", apiKeyAuth, shippingController.userServices);
router.post("/GenerateLabel", apiKeyAuth, shippingController.generateLabel);
router.post("/CancelLabel", apiKeyAuth, shippingController.cancelLabel);

export default router;
