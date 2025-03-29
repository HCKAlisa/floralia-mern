import type { Request, Response, NextFunction } from 'express';
import {errorHandler} from "../utils/error.ts";
import User from "../models/user.model.ts";
import mongoose from "mongoose";

export const test = (req: Request, res: Response) => {
    res.json({ message: "API is working" });
};

export const deleteUser = async (req: Request, res: Response, next:NextFunction) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(200).json('User has been deleted');
    } catch (error) {
        next(error);
    }
};

export const signout = (req: Request, res: Response, next: NextFunction) => {
    try {
        res
            .clearCookie('access_token')
            .status(200)
            .json('User has been signed out');
    } catch (error) {
        next(error);
    }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return next(errorHandler('404', 'User not found'));
        }
        const { password, ...rest } = (user as mongoose.Document & { password?: string }).toObject();
        res.status(200).json(rest);
    } catch (error) {
        next(error);
    }
};