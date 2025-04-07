import type {NextFunction, Request, Response} from 'express';
import User from "../models/user.model.ts";
import { genSaltSync, hashSync, compareSync } from "bcrypt-ts";
import { errorHandler } from "../utils/error.ts";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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

export const signin = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, password } = req.body;

    if (!username || !password || username === "" || password === "" ) {
        return next(errorHandler('400', 'All fields are required'));
    }

    try{
        const validUser = await User.findOne({ username });

        if (!validUser) {
            return next(errorHandler('404', 'User not found'));
        }

        const hashedPassword = validUser!.password;
        const isValidPassword = compareSync(password, hashedPassword);

        if (!isValidPassword) {
            return next(errorHandler('400', 'Invalid password'));
        }

        const token = jwt.sign(
            {
                id: validUser!._id
            },
            process.env.JWT_SECRET!,
            {expiresIn: '1d'}
        );

        const { password: dbPassword, ... rest} = (validUser as mongoose.Document & { password?: string }).toObject();

        res.status(200)
            .cookie('access_token', token, {httpOnly: true})
            .json(rest);

    } catch (error: any) {
        next(error);
    }
});

export const google = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const {email, name, googlePhotoUrl} = req.body;
    try {
        const user = await User.findOne({email});
        if (user){
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET!);
            const { password, ... rest} = (user as mongoose.Document & { password?: string }).toObject();
            res.status(200)
                .cookie('access_token', token, {httpOnly: true})
                .json(rest);
        } else {
            next(errorHandler('404', 'No User Account'));
            // const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
            // const salt = genSaltSync(10);
            // const hashedPassword = hashSync(generatedPassword, salt);
            // const newUser = new User({
            //     username: name.toLowerCase().split(" ").join("") + Math.random().toString(9).slice(-4),
            //     email,
            //     password: hashedPassword,
            //     profilePicture: googlePhotoUrl
            // });
            // await newUser.save();
            // const token = jwt.sign({id: newUser._id}, process.env.JWT_SECRET!, {expiresIn: '1d'});
            // const { password, ... rest} = (newUser as mongoose.Document & { password?: string }).toObject();
            // res.status(200)
            //     .cookie('access_token', token, {httpOnly: true})
            //     .json(rest);
        }
    }catch (e) {
        next(e);
    }
});