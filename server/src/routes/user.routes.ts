import express from "express";
import User from "../models/user.model.ts";
import {verifyToken} from "../utils/verifyUser.ts";
import {deleteUser, signout} from "../controllers/user.controller.ts";
// import {test} from "../controllers/user.controller.ts"

const router = express.Router();

// router.get("/test", test);

router.post("/user", (req, res) => {
    const newUser = new User(req.body);
})


router.delete('/delete/:userId', verifyToken, deleteUser);
router.post('/signout', signout);

export default router;