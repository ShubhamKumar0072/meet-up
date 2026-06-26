import "./ChatPage.css";
import { hasPrivateKey } from "../store/keyStore";
import { useState } from "react";

import { decryptWithPin } from "../utils/cryptoService";
import { setPrivateKey } from "../store/keyStore";

export default function OneChat({ user }) {

    const [needsUnlock, setNeedsUnlock] = useState(!hasPrivateKey());
    const [pin, setPin] = useState("");

    const handleUnlock = async (e) => {
        e.preventDefault();

        try {

            const privateKey = await decryptWithPin(
                user.encryptedPrivateKey,
                pin
            );
            setPrivateKey(privateKey);
            setNeedsUnlock(false);

        } catch (err) {
            alert("Incorrect PIN");
        }
    }

    if (needsUnlock) {
        return (
            <div className="UnlockPage">

                <div className="unlock-box">
                    <h2>Unlock Chat</h2>
                    <p>Enter your PIN to unlock your private key.</p>

                    <form onSubmit={handleUnlock}>

                        <input
                            type="password"
                            placeholder="Enter PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                        />

                        <button type="submit">
                            Unlock
                        </button>

                    </form>

                </div>

            </div>
        );
    }



    return (
        <div className="ChatPage">
            <div className="chat-header">
                Shubham Kumar
            </div>
            <div className="chat-body">
                <div className="message left">&Lorem ipsum dolor sit amet consectetur adipisicing elit. Et voluptatum a laborum? Doloremque rem eveniet qui nihil nulla accusamus sit?</div>
                <div className="message right">&Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit nisi neque, labore, modi excepturi ratione architecto vitae odio quas libero consectetur possimus minima eos nulla.</div>
                <div className="message left">&Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos, saepe.</div>
                <div className="message right">&Lorem ipsum dolor sit amet consectetur.</div>
                <div className="message left">&Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi, itaque exercitationem? Fugiat totam quam doloribus praesentium optio fugit natus, enim, temporibus possimus reprehenderit accusamus iste debitis, omnis ipsum mollitia soluta sit consequuntur.</div>
            </div>
            <div className="chat-footer">
                <input className="chat-input" type="text" placeholder="Type a message" />
                <button className="chat-send-btn">Send</button>
            </div>
        </div>
    );
}