import express from "express";
import { createUser } from "../controllers/userController.js";
import { authenticateJWT, restrictToRoles } from "../middleware/auth.js";
const router = express.Router();

router.post("/", authenticateJWT, restrictToRoles(["Admin"]), createUser);

export default router;
