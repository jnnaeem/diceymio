import { Router } from "express";
import { signupController, loginController, getMeController, updateProfileController, changePasswordController } from "./auth.controller";
import { authenticate } from "../../middleware/auth";

const router = Router();

router.post("/signup", signupController);
router.post("/login", loginController);

// Profile routes
router.get("/me", authenticate, getMeController);
router.patch("/profile", authenticate, updateProfileController);
router.patch("/change-password", authenticate, changePasswordController);

export default router;
