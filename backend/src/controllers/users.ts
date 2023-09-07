import { isHexString, isValidAddress } from "ethereumjs-util";
import { RequestHandler } from "express";
import HttpError, { StatusCodes } from "../errors/http-error";
import User from "../models/user";
import { generateJwt } from "../utils/generate-jwt";
import { generateNonce, recoverAddress } from "../utils/sig-utils";

export const getAuthenticatedUser: RequestHandler = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId).exec();

        if (!user)
            throw new HttpError(StatusCodes.NOT_FOUND, "User not found.");

        res.status(StatusCodes.OK).json(user.toJSON());
    } catch (error) {
        next(error);
    }
};

interface GetNonceBody {
    address: string;
}

export const getNonce: RequestHandler<
    unknown, unknown, GetNonceBody, unknown
> = async (req, res, next) => {
    const address = req.body.address.toLowerCase();
    
    try {
        if (!address)
            throw new HttpError(StatusCodes.BAD_REQUEST, "Address required.");

        if (!isValidAddress(address))
            throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid address.");

        const nonce = generateNonce();
        let user = await User.findOne({ address: address }).exec();
        
        if (!user) {
            // create user if doesn't exist
            user = await User.create({ address: address, nonce: nonce });
        } else {
            // update user nonce
            user.nonce = nonce;
            await user.save();
        }

        res.status(StatusCodes.OK).json(user.nonce);
    } catch (error) {
        next(error);
    }
};

interface SignInBody {
    address: string;
    signature: string;
}

export const signIn: RequestHandler<
    unknown, unknown, SignInBody, unknown
> = async (req, res, next) => {
    const address = req.body.address.toLowerCase();
    const signature = req.body.signature;
    
    try {
        if (!address || !signature)
            throw new HttpError(StatusCodes.BAD_REQUEST, "Address and signature required.");

        if (!isValidAddress(address))
            throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid address.")

        if (!(isHexString(signature)))
            throw new HttpError(StatusCodes.BAD_REQUEST, "Invalid signature.");

        const user = await User.findOne({ address: address }).exec();
        
        if (!user)
            throw new HttpError(StatusCodes.NOT_FOUND, "User not found.");

        const signerAddress = recoverAddress(user.nonce, signature);

        // check if recovered address matches user's address
        if(signerAddress.toLowerCase() !== user.address)
            throw new HttpError(StatusCodes.UNAUTHORIZED, "Address doesn't match.");

        // change user nonce for security
        user.nonce = generateNonce();
        await user.save();
        generateJwt(res, { _id: user._id, address: user.address });
        res.status(StatusCodes.OK).json(user.toJSON());
    } catch (error) {
        next(error);
    }
};

export const updateUsername: RequestHandler = async (req, res, next) => {
    const newUsername = req.body.username;

    try {
        if (!newUsername)
            throw new HttpError(StatusCodes.BAD_REQUEST, "Username required.");

        const user = await User.findById(req.user.userId).exec();
        
        if (!user)
            throw new HttpError(StatusCodes.NOT_FOUND, "User not found.");
        
        user.username = newUsername;
        const updatedUser = await user.save();
        res.status(StatusCodes.OK).json(updatedUser.toJSON());
    } catch (error) {
        next(error);
    }
};
