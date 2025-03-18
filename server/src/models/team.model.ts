import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const TeamSchema = new Schema({
        name: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        image: {
            type: String,
            required: true,
        }},
    {timestamps: true}
);

const TeamModel = mongoose.model('Team', TeamSchema);

export default TeamModel;