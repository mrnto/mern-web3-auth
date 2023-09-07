import { User } from "../models/user";
import { fetchData } from "../utils/fetch-data";

export const getSignedInUser = async (): Promise<User> => {
    const response = await fetchData("/api/users", { method: "GET" });
    return response.json();
};

export const getNonce = async (address: string): Promise<string> => {
    const response = await fetchData("/api/users/nonce", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"address": address}),
    });
    return response.json();
};

export const signIn = async (address: string, signature: string): Promise<User> => {
    const response = await fetchData("/api/users/signature", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"address": address, "signature": signature}),
    });
    return response.json();
};

export const updateUsername = async (username: string): Promise<User> => {
    const response = await fetchData("/api/users/username", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({"username": username}),
    });
    return response.json();
};
