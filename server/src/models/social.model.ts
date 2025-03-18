import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const SocialSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
        image: {
            type: String,
        }},
    {timestamps: true}
);

const SocialModel = mongoose.model('Social', SocialSchema);

export default SocialModel;