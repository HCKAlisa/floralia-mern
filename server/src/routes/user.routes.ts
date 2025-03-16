import express from "express";
import User from "../models/user.ts";
import {test} from "../controllers/user.controller.ts"

const router = express.Router();

router.get("/test", test);

router.post("/user", (req, res) => {
    const newUser = new User(req.body);
})

export default router;