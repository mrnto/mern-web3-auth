import { randomBytes } from "crypto";
import {
    bufferToHex,
    ecrecover,
    fromRpcSig,
    hashPersonalMessage,
    publicToAddress,
    toBuffer,
} from "ethereumjs-util";

const generateNonce = (): string => {
    return randomBytes(4).toString("hex").toUpperCase();
};

const recoverAddress = (msg: string, sig: string): string => {
    // convert msg to hex string
    const msgHex = bufferToHex(Buffer.from(msg));
    // get hash of hexed msg converted to buffer
    const msgHash = hashPersonalMessage(toBuffer(msgHex));

    // get signature parameters
    const sigParams = fromRpcSig(sig);

    // recover public key from signature
    const publicKey = ecrecover(msgHash, sigParams.v, sigParams.r, sigParams.s);

    // get address from public key and convert it to hex
    const recoveredAddress = bufferToHex(publicToAddress(publicKey));

    return recoveredAddress;
}

export { generateNonce, recoverAddress };
