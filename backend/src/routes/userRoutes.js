import express from "express";
import { createUser, getUsers } from "../controllers/userController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();
router.use(authMiddleware);

router.get("/", getUsers);
router.post("/", createUser);

export default router;
