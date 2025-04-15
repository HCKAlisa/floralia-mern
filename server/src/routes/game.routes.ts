import express from "express";
import {verifyToken} from "../utils/verifyUser.ts";
import {create, deleteGame, getGames} from "../controllers/game.controller.ts";

const router = express.Router();

router.post('/create', verifyToken, create);
router.get('/getGames', getGames);
router.put('/updateGame/:gameId', getGames);
router.delete('/delete/:gameId', verifyToken, deleteGame);

export default router;