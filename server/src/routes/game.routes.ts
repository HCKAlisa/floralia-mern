import express from "express";
import {verifyToken} from "../utils/verifyUser.ts";
import {create, getGames} from "../controllers/game.controller.ts";

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getGames', getGames);

export default router;