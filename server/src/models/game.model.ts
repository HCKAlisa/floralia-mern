import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const GameSchema = new Schema({
        id: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true,
            unique: true
        },
        media: {
            type: String,
            required: true,
        },
        socials: {
            type: Array
        },
        steam: {
            type: String,
            required: true,
        },
        released: {
            type: Boolean,
        },
        isVideo: {
            type: Boolean,
        },
        slug: {
            type: String,
            required: true,
            unique: true
        }},
    {timestamps: true}
);

const GameModel = mongoose.model('Game', GameSchema);

export default GameModel;