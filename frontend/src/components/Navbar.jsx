import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { socket } from "../socket";

import { useNavigate } from "react-router-dom";
import { NavLink } from "react-router-dom";

import {Search, Plus, Settings} from "lucide-react";





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
        <aside className="Navbar">

            <div className="navbar-header">

                <h1 className="logo">
                    💬 MeetUp
                </h1>

                <p>
                    Secure conversations
                </p>

            </div>

            <form
                className="search-form"
                onSubmit={handleCreateConv}
            >

                <input
                    className="search"
                    type="text"
                    placeholder="Enter username..."
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <button type="submit">
                    +
                </button>

            </form>

            <div className="chat-list">

                {conversations.map((conversation) => {

                    const otherUser = conversation.participants.find(
                        participant => participant._id !== user.id
                    );

                    return (

                        <NavLink
                            className={({isActive})=>`chat-link ${isActive? "active":""}`}
                            key={conversation._id}
                            to={`/chat/${conversation._id}`}
                            state={{ conversation }}
                        >

                            <div className="chat-item">

                                <img
                                    src={otherUser.profilePic}
                                    alt={otherUser.name}
                                />

                                <div className="chat-info">

                                    <h4>
                                        {otherUser.name}
                                    </h4>

                                    <p>
                                        Click to continue chatting
                                    </p>

                                </div>

                            </div>

                        </NavLink>

                    );

                })}

            </div>

            <div className="my-profile">

                <Link
                    className="profile-link"
                    to="/profile"
                >

                    <img
                        src={user.profilePic}
                        alt={user.name}
                    />

                    <div>

                        <h4>{user.name}</h4>

                        <span>View Profile</span>

                    </div>

                </Link>

                <Link to="/setting">

                    <button className="settings-btn">
                        <Settings size={22} />
                    </button>

                </Link>

            </div>

        </aside>
    )
}