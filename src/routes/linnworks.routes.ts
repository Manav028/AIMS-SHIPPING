import { Router } from "express";
import { authenticate } from "../middleware/auth";
import {addNewUserController} from "../controllers/auth.controller";
import {userConfigController,updateConfigController} from "../controllers/config.controller";
import {userAvailableServicesController} from "../controllers/service.controller";
import {generateLabelController,cancelLabelController} from "../controllers/label.controller";
import {createManifestController} from "../controllers/manifest.controller";

const router = Router();

router.post("/AddNewUser", addNewUserController);
router.post("/UserConfig", authenticate, userConfigController);
router.post("/UpdateConfig", authenticate, updateConfigController);
router.post("/UserAvailableServices", authenticate, userAvailableServicesController);
router.post("/GenerateLabel", authenticate, generateLabelController);
router.post("/CancelLabel", authenticate, cancelLabelController);
router.post("/CreateManifest", authenticate, createManifestController);

export default router;