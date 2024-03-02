import express from "express";

import { AccountController } from "src/controllers/account.controller";
import { registerSchema, changePasswordSchema } from "./dtos/account.dto";
import { validate } from "src/middleware/validate.middleware";

const router = express.Router();

router.get("/create", AccountController.create);
router.get("/get/:id", AccountController.get);

router.post("/register/", validate(registerSchema), AccountController.register);
router.post("/change-password/", validate(changePasswordSchema), AccountController.changePassword);

export default router;
