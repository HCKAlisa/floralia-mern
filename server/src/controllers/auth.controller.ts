import type { Request, Response } from 'express';

export const signup = async (req: Request, res: Response) => {
    const {username, email, password} = req.body;

    if (!username || !email || !password || username === "" || password === "" || email === "") {
        return res.status(400).json({ message: 'All fields are required' });
    }
};