import express from "express";

import { AccountController } from "src/controllers/account.controller";

const router = express.Router();

router.get("/create", AccountController.create);
router.get("/get/:id", AccountController.get);

export default router;
