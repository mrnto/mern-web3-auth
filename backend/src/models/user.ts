import { Schema, model } from "mongoose";

export interface User {
    address: string;
    nonce: string;
    username?: string;
}

const userSchema = new Schema<User>({
    address: { type: String, required: true, unique: true },
    nonce: { type: String, required: true },
    username: { type: String }
});

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.nonce;
    return obj;
};

export default model<User>("User", userSchema);
