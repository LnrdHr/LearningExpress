import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({

    name: {
        type: mongoose.Schema.Types.String,
        required: true,
        //only one user can have same name
        unique: true,
    },
    password: {
        type: mongoose.Schema.Types.String,
        required: true,
    },
});

//we use this to reference user
export const User = mongoose.model('user', UserSchema);

