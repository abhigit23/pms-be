import express from "express";
import { addWorkInProgress } from "../controllers/workInProgress";

const router = express.Router();

router.post("/workInProgress", addWorkInProgress);

export default router;
