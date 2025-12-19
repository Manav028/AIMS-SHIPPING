import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {addNewUserController} from "../controllers/auth.controller";
import {userConfigController,updateConfigController} from "../controllers/config.controller";
import {userAvailableServicesController} from "../controllers/service.controller";
import {generateLabelController,cancelLabelController} from "../controllers/label.controller";
import {createManifestController} from "../controllers/manifest.controller";

const router = Router();

router.post("/AddNewUser", addNewUserController);
router.post("/UserConfig", authMiddleware, userConfigController);
router.post("/UpdateConfig", authMiddleware, updateConfigController);
router.post("/UserAvailableServices", authMiddleware, userAvailableServicesController);
router.post("/GenerateLabel", authMiddleware, generateLabelController);
router.post("/CancelLabel", authMiddleware, cancelLabelController);
router.post("/CreateManifest", authMiddleware, createManifestController);
export default router;