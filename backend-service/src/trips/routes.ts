import { Router } from "express";
import { completeTrip, dispatchEmergencyRoute } from "./controllers.js";

const router = Router();

router.post('/dispatch', dispatchEmergencyRoute);
router.post('/:id/complete', completeTrip);

export default router;