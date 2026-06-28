import "./Settings.css";
import {
    LogOut,
    Trash2,
    BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clearPrivateKey } from "../store/keyStore";
import { socket } from "../socket";
import axios from "axios"

export default function Settings() {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // Remove JWT
        localStorage.removeItem("token");

        // Remove decrypted private key from memory
        clearPrivateKey();

        // Disconnect socket
        socket.disconnect();

        window.location.replace("/");
    };

    const handelManual = () => {
        navigate("/user-manual");
    };

    const handelDelete = async () => {
        try {

            const token = localStorage.getItem("token");
            const response = await axios.delete(
                `${import.meta.env.VITE_API_URL}/auth/delete`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            window.location.replace("/");

        } catch (error) {
            console.log(error);
            alert("cant delet user by some technical issue");
            return;
        }
    }


    return (

        <div className="settings-page">

            <div className="settings-card">

                <h2>Settings</h2>

                <p>
                    Manage your account and application preferences.
                </p>

                <div className="setting-item">

                    <div className="setting-info">

                        <LogOut size={22} />

                        <div>

                            <h3>Logout</h3>

                            <span>
                                Sign out of your account.
                            </span>

                        </div>

                    </div>

                    <button className="setting-btn" onClick={handleLogout}>
                        Logout
                    </button>

                </div>

                <div className="setting-item">

                    <div className="setting-info">

                        <BookOpen size={22} />

                        <div>

                            <h3>User Manual</h3>

                            <span>
                                Learn how to use MeetUp.
                            </span>

                        </div>

                    </div>

                    <button className="setting-btn" onClick={handelManual}>
                        Open
                    </button>

                </div>

                <div className="setting-item danger">

                    <div className="setting-info">

                        <Trash2 size={22} />

                        <div>

                            <h3>Delete Account</h3>

                            <span>
                                Permanently remove your account and chats.
                            </span>

                        </div>

                    </div>

                    <button className="danger-btn" onClick={handelDelete}>
                        Delete
                    </button>

                </div>

            </div>

        </div>

    );

}