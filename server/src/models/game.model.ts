import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const GameSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        media: {
            type: String,
            required: true,
        },
        socials: {
            type: Array,
            required: true,
        },
        steam: {
            type: String,
            required: true,
        },
        released: {
            type: Boolean,
        }},
    {timestamps: true}
);

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;