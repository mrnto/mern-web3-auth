import { Buffer } from "buffer";
import makeBlockie from "ethereum-blockies-base64";
import { useEffect, useRef, useState } from "react";
import * as UsersApi from "./api/users";
import { Spinner } from "./components";
import { User } from "./models/user";
import { truncateAddress } from "./utils/truncate-address";
import "./styles/app.css";

function App() {
    const [address, setAddress] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [signedInUser, setSignedInUser] = useState<User | null>(null);

    const [isInputVisible, setInputVisible] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        checkConnectedWallet();
    }, []);

    useEffect(() => {
        const fetchSignedInUser = async () => {
            try {
                setLoading(true);
                const user = await UsersApi.getSignedInUser();
                setSignedInUser(user);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (address) fetchSignedInUser();
    }, [address]);

    const connectWallet = async () => {
        if (!window.ethereum) return alert("Install MetaMask on metamask.io");
        await window.ethereum
            .request({ method: 'eth_requestAccounts' })
            .then((accounts: Array<string>) => setAddress(accounts[0]))
            .catch((error: Error) => console.log(error));
    };

    const checkConnectedWallet = async () => {
        if (!window.ethereum) return;
        await window.ethereum
            .request({ method: "eth_accounts" })
            .then((accounts: Array<string>) => {
                if (accounts.length) setAddress(accounts[0]);
            })
            .catch((error: Error) => console.log(error));
    };

    const signNonce = async (address: string) => {
        try {
            // get nonce
            const nonce = await UsersApi.getNonce(address);
            // convert nonce to hex
            const nonceHex = `0x${Buffer.from(nonce, "utf8").toString("hex")}`;
            // request message signature with wallet
            const signedNonce = await window.ethereum.request({
                method: "personal_sign",
                params: [nonceHex, address],
            });
            // send signature
            const user = await UsersApi.signIn(address, signedNonce);
            setSignedInUser(user);
        } catch (error) {
            console.error(error);
        }
    };

    const updateUsername = async (username: string) => {
        try {
            const user = await UsersApi.updateUsername(username);
            setSignedInUser(user);
        } catch (error) {
            console.error(error);
        }
    };

    const handleClick = () => {
        const newUsername = inputRef.current?.value;
        if (!newUsername) return;
        updateUsername(newUsername);
        setInputVisible(false);
    };

    return (
        <div className="content text-center text-white">
            {!address && <>
                <p className="font-medium text-xlg mb-2">
                    Connect your wallet
                </p>
                <button onClick={connectWallet}>
                    Connect
                </button>
            </>}

            {address && loading && <Spinner/>}

            {address && !loading && !signedInUser && <>
                <p className="font-medium text-xlg mb-2">
                    Sign one-time nonce
                </p>
                <button onClick={() => signNonce(address)}>
                    Sign
                </button>
            </>}

            {!loading && signedInUser &&
                <div className="profile">
                    <div>
                        <img
                            src={makeBlockie(signedInUser.address)}
                            alt="identicon"
                        />
                        <p className="font-bold text-xlg">
                            {truncateAddress(signedInUser.address)}
                        </p>
                    </div>
                    <div>
                        <p className="font-bold text-lg">Username:</p>
                        <p>{signedInUser.username ? signedInUser.username : "Not choosen yet."}</p>
                    </div>
                    <div>
                        {!isInputVisible ?
                            <button onClick={() => setInputVisible(true)}>
                                Edit
                            </button>
                        : <>
                            <input
                                type="text"
                                placeholder="username"
                                ref={inputRef}
                            />
                            <button onClick={handleClick}>Save</button>
                        </>}
                    </div>
                </div>
            }
        </div>
    );
}

export default App;
