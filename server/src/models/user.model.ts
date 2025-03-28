import mongoose from "mongoose";

const Schema = mongoose.Schema;
// const ObjectId = Schema.Types.ObjectId;

const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        default: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Profile_avatar_placeholder_large.png?20150327203541"
    }
    },
    {timestamps: true}
);

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
