import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const FaqSchema = new Schema({
        question: {
            type: String,
            required: true,
        },
        answer: {
            type: String,
            required: true,
        }},
    {timestamps: true}
);

const FaqModel = mongoose.model('Faq', FaqSchema);

export default FaqModel;