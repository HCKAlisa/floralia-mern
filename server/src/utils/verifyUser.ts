import jwt from 'jsonwebtoken';
import { errorHandler } from './error.ts';
import type { Response, NextFunction } from 'express';

export const verifyToken = (req: any, _res: Response, next: NextFunction) => {
    const token = req.cookies.access_token;
    if (!token) {
        return next(errorHandler('401', 'Unauthorized'));
    }
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
        if (err) {
            return next(errorHandler('401', 'Unauthorized'));
        }
        req.user = user;
        next();
    });
};