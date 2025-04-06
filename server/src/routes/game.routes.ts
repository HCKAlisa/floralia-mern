import express from "express";
import {verifyToken} from "../utils/verifyUser.ts";
import {create} from "../controllers/game.controller.ts";

const router = express.Router();

router.post('/create', verifyToken, create);

export default router;