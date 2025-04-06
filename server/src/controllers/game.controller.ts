import type {NextFunction, Request, Response} from 'express';
import {errorHandler} from "../utils/error.ts";
import GameModel from "../models/game.model.ts";


export const create = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.body.name || !req.body.steam || !req.body.socials || !req.body.media){
        return next(errorHandler("400", 'Please provide all required fields'));
    }

    const slug = req.body.name.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newGame = new GameModel ({
        ...req.body, slug
    });

    try {
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (e) {
        next(e);
    }



}