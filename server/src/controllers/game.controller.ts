import type {NextFunction, Request, Response} from 'express';
import {errorHandler} from "../utils/error.ts";
import Game from "../models/game.model.ts";


export const create = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.body.name || !req.body.steam || !req.body.socials || !req.body.media){
        return next(errorHandler("400", 'Please provide all required fields'));
    }

    const slug = req.body.name.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-');
    const newGame = new Game ({
        ...req.body, slug
    });

    try {
        const savedGame = await newGame.save();
        res.status(201).json(savedGame);
    } catch (e) {
        next(e);
    }

};

export const getGames = async (_req: Request, res: Response, next: NextFunction)=> {
    try {
        const games = await Game.find();
        res.status(200).json(games);
    } catch (e) {
        next(e);
    }
};