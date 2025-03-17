import type {NextFunction, Request, Response} from 'express';
import User from "../models/user.ts";
import { genSaltSync, hashSync } from "bcrypt-ts";
import {errorHandler} from "../utils/error.ts";

/*
asyncHandler is a utility function that takes another function (fn) as an argument and returns a middleware function compatible with Express.
It ensures that any errors thrown within fn are passed to the next middleware in the chain using next(error).
 */
const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};

export const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password || username === "" || password === "" || email === "") {
        next(errorHandler('400', 'All fields are required'));
    }

    const salt = genSaltSync(10);
    const hashedPassword = hashSync(password, salt);

    const newUser = new User({
        username: username,
        email: email,
        password: hashedPassword,
    });

    try{
        await newUser.save();
        res.json({ message: 'User successfully created!' });
    } catch (error: any) {
        next(error);
    }
});