import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

import { useNavigate } from "react-router-dom";





export default function Navbar({ user }) {
    const navigate = useNavigate();

    const [conversations, setConversations] = useState([]);
    const [username, setUsername] = useState("");

    const handleCreateConv = async (e) => {
        e.preventDefault();
        if (!username.trim()) return;

        try {
            const token = localStorage.getItem("token");
            const responce = await axios.post(
                `${import.meta.env.VITE_API_URL}/conv/create`,
                {
                    username: username
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            )
        } catch (error) {
            alert("Incorrect UserName");
        }
        setUsername("");
    }

    //Socket.io Initialised for mapping
    useEffect(() => {
        if (user) {
            socket.emit("setupUser", user.id);
        }
    }, [user]);

    useEffect(() => {
        const fetchConversations = async () => {
            try {
                const token = localStorage.getItem("token");
                //console.log("Token : ", token);
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/conv`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );
                //console.log(response.data[0]);
                setConversations(response.data || []);
            } catch (error) {
                console.log(error);
            }
        };
        fetchConversations();
    }, [])

    useEffect(() => {
        const handleNewConversation = (data) => {

            const conversation = data.conversation;

            setConversations((prev) => {
                const exists = prev.find(c => c._id === conversation._id);
                if (exists) return prev;

                return [conversation, ...prev];
            });

            // 🚀 ONLY AUTO OPEN IF CREATED BY ME
            if (data.createdByMe) {
                navigate(`/chat/${conversation._id}`, {
                    state: { conversation }
                });
            }
        };

        socket.on("newConversation", handleNewConversation);

        return () => {
            socket.off("newConversation", handleNewConversation);
        };
    }, []);

    //console.log(conversations);
    return (
        <div className="Navbar">
            <h1 className="logo">MeetUp</h1>
            <form onSubmit={handleCreateConv}>
                <input
                    className="search"
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value) }}
                />
                <button type="submit" >StartChat</button>
            </form>
            <br />
            <br />


            <div className="chat-list">

                {conversations.map((conversation) => {
                    //console.log(conversation);
                    //console.log("User Data : ", user.id);
                    const otheruser = conversation.participants.find(
                        participant => participant._id !== user.id
                    );

                    //console.log("other user : ", otheruser);

                    return (
                        <Link to={`/chat/${conversation._id}`} key={conversation._id} state={{ conversation }}>
                            <div className="chat-item">
                                <img src={otheruser.profilePic} alt={otheruser.name} width={40} height={40} />
                                <span>{otheruser.name}</span>
                            </div>
                        </Link>
                    );

                })}
            </div>

            <div className="my-profile">
                <Link to="/profile"><p>{user.name}</p></Link>
                <Link to="/setting"><button>Settings</button></Link>
            </div>
        </div>
    )
}