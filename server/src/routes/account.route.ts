import express from "express";

import { AccountController } from "src/controllers/account.controller";
import { registerSchema, updateNameSchema } from "./dtos/account.dto";
import { validate } from "src/middleware/validate.middleware";

const router = express.Router();

router.get("/create", AccountController.create);
router.get("/get/:id", AccountController.get);

router.post("/update-name/", validate(updateNameSchema), AccountController.updateName);
router.post("/register/", validate(registerSchema), AccountController.register);
// router.post("/register/", AccountController.register);

export default router;
