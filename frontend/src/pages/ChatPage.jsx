import "./ChatPage.css";
import "./LockPage.css";
import { hasPrivateKey, getPrivateKey } from "../store/keyStore";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { decryptWithPin } from "../utils/cryptoService";
import { setPrivateKey } from "../store/keyStore";
import { useParams } from "react-router-dom";
import { decryptAESKey } from "../utils/rsaCrypto";
import { encryptMessage, decryptMessage } from "../utils/messageCrypto";
import axios from "axios";
import { useRef } from "react"; //to control scrolling

import { socket } from "../socket";
import { LockKeyhole } from "lucide-react";



export default function OneChat({ user }) {
    const { state } = useLocation();
    const chatEndRef = useRef(null);

    //Unlock setup if user refresh reloade pin
    const [needsUnlock, setNeedsUnlock] = useState(!hasPrivateKey());
    const [pin, setPin] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [aesKey, setAesKey] = useState(null);
    const [decryptedMessages, setDecryptedMessages] = useState([]);
    const [initialLoad, setInitialLoad] = useState(true); //control scroll
    const [secUser,setSecUser] = useState(null);

    //function to scroll to bottom
    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

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

    const handelSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            return;
        }

        try {
            //Encrypt the message.
            const encryptedContent = await encryptMessage(
                message,
                aesKey
            );

            //send encrypted message
            const token = localStorage.getItem("token");

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/msg/send`,
                {
                    conversationId,
                    encryptedContent
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage("");

        } catch (error) {
            console.log(error);
        }
    }

    const loadOlderMessages = async () => {

        if (messages.length === 0) return;
        try {

            const token = localStorage.getItem("token");
            const oldestMsgId = messages[0]._id;

            const responce = await axios.get(
                `${import.meta.env.VITE_API_URL}/msg/${conversationId}`,
                {
                    params: {
                        before: oldestMsgId
                    },
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const loadOlderMessages = responce.data;
            //merge older in messages
            setMessages(prev => [...loadOlderMessages, ...prev]);

        } catch (error) {
            console.log(error);
        }

    }

    //if user is unlocked
    const { conversationId } = useParams();
    
    
    //featch Conversation
    // useEffect(()=>{
    //     if(needsUnlock) return;

    //     const fetchConv = async () => {
    //         const token = localStorage.getItem("token");
    //         const responce = await axios.get(
    //             `${import.meta.env.VITE_API_URL}/conv/${conversationId}`,
    //             {
    //                 headers: { Authorization: `Bearer ${token}` }
    //             }
    //         );

    //         console.log(responce);

    //     }
    // },[])

    //fetch messages



    useEffect(() => {
        setMessages([]);
        setDecryptedMessages([]);
        setAesKey(null);
    }, [conversationId]);

    useEffect(() => {
        if (needsUnlock) return;

        const fetchMessages = async () => {
            const token = localStorage.getItem("token");

            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/msg/${conversationId}`,
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            setMessages(response.data);
            setInitialLoad(true); //to prevent scroll further
        };

        fetchMessages();
    }, [conversationId, needsUnlock]);


    useEffect(() => {
        if (!aesKey || messages.length === 0) return;

        const decryptAll = async () => {
            const decrypted = await Promise.all(
                messages.map(async (msg) => ({
                    ...msg,
                    content: await decryptMessage(
                        msg.encryptedContent,
                        aesKey
                    )
                }))
            );

            setDecryptedMessages(decrypted);
        };

        decryptAll();
    }, [messages, aesKey]);

    useEffect(() => {
        if (initialLoad && decryptedMessages.length > 0) {
            scrollToBottom();
            setInitialLoad(false);
        }
    }, [decryptedMessages]);

    useEffect(() => {
        if (needsUnlock || !state?.conversation) return;

        const conversation = state.conversation;
        const otherUser = conversation.participants.find(
                        participant => participant._id !== user.id
                    );
        setSecUser(otherUser);

        const encryptedAESKey =
            conversation.participants[0]._id === user.id
                ? conversation.encryptedAESKeys.user0
                : conversation.encryptedAESKeys.user1;

        const privateKey = getPrivateKey();

        const key = decryptAESKey(encryptedAESKey, privateKey);

        setAesKey(key);
    }, [state, user.id, needsUnlock]);


    //Runs to make a connection to room with convId or leave one room
    useEffect(() => {
        if (needsUnlock) return;

        socket.emit("joinConv", conversationId);

        return () => {
            socket.emit("leaveConv", conversationId);
        }

    }, [conversationId, needsUnlock]);

    //Runs ones to start listning for incoming messages
    useEffect(() => {

        if (!aesKey) return;

        const handleNewMessage = async (msg) => {

            const decrypted = {
                ...msg,
                content: await decryptMessage(
                    msg.encryptedContent,
                    aesKey
                )
            };

            setDecryptedMessages(prev => [
                ...prev,
                decrypted
            ]);
        };

        socket.on("newMessage", handleNewMessage);

        return () => {
            socket.off("newMessage", handleNewMessage);
        };

    }, [aesKey]);



    if (needsUnlock) {
        return (
            <div className="lock-page">

                <div className="lock-box">

                    <div className="lock-icon">
                        <LockKeyhole size={34} />
                    </div>

                    <h2>Unlock Chat</h2>

                    <p>
                        Enter your 6-digit PIN to access your conversations.
                    </p>

                    <form
                        className="lock-form"
                        onSubmit={handleUnlock}
                    >

                        <input
                            type="password"
                            placeholder="Enter your PIN"
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

                <div className="chat-user">

                    {secUser && <img
                        src={secUser.profilePic}
                        alt={secUser.name}
                    />}

                    

                    <div>
                        {secUser && <h3>{secUser.name}</h3>}
                        
                        {secUser && <span>{secUser.username}</span>}

                    </div>

                </div>

            </div>

            <div className="chat-body">

                {messages.length >= 30 && (

                    <button
                        onClick={loadOlderMessages}
                        className="load-more-btn"
                    >
                        Load previous messages
                    </button>

                )}

                {decryptedMessages.map((msg) => (

                    <div
                        key={msg._id}
                        className={
                            msg.sender._id === user.id
                                ? "message right"
                                : "message left"
                        }
                    >
                        {msg.content}
                    </div>

                ))}

                <div ref={chatEndRef} />

            </div>

            <div className="chat-footer">

                <form
                    className="chat-form"
                    onSubmit={handelSendMessage}
                >

                    <input
                        className="chat-input"
                        type="text"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />

                    <button
                        className="chat-send-btn"
                    >
                        Send
                    </button>

                </form>

            </div>

        </div>
    );
}