import { Router } from "express";
import { getNearestVehicles } from "./controllers.js";

const router = Router();

router.get('/nearest', getNearestVehicles);

export default router;