import {errorHandler} from "../utils/error.ts";
import Game from "../models/game.model.ts";
import type {NextFunction, Request, Response} from 'express';


export const create = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.body.name || !req.body.steam || !req.body.socials){
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

export const deleteGame = async (req: Request, res: Response, next:NextFunction) => {
    try {
        await Game.findOneAndDelete({id: req.params.gameId}, {});
        res.status(200).json(req.params.gameId + 'game has been deleted');
    } catch (error) {
        next(error);
    }
};

export const updateGame = async (req: Request, res: Response, next: NextFunction)=> {

    if (!req.body.name || !req.body.steam || !req.body.socials){
        return next(errorHandler("400", 'Please provide all required fields'));
    }
    try {
        const updatedGame = await Game.findOneAndUpdate(
            {id: req.params.gameId},
            {
                $set: {
                    name: req.body.name,
                    socials: req.body.socials,
                    media: req.body.media,
                    isVideo: req.body.isVideo,
                    steam: req.body.steam,
                    released: req.body.released
                },
            },
            { new: true }
        );
        res.status(200).json(updatedGame);
    } catch (error) {
        next(error);
    }

};