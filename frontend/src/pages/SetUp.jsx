import { generateRSAKeys, encryptWithPin } from "../utils/cryptoService";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { setPrivateKey } from "../store/keyStore";
import axios from "axios";
import "./SetUp.css";

function SetUp({ fetchCurrentUser }) {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [pin, setPin] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);

            // Read JWT
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("User not authenticated");
            }

            // Generate RSA Key Pair
            const { publicKey, privateKey } = generateRSAKeys();

            // Encrypt private key using PIN
            const encryptedPrivateKey = await encryptWithPin(
                privateKey,
                pin
            );

            // Send setup data to backend
            await axios.post(
                `${import.meta.env.VITE_API_URL}/auth/setup`,
                {
                    username,
                    publicKey,
                    encryptedPrivateKey,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Refresh current user
            await fetchCurrentUser();

            // 4. Store decrypted private key in memory
            setPrivateKey(privateKey);

            // Go to chat
            navigate("/chat");

        } catch (error) {

            console.error(error);

            alert(
                error.response?.data?.message ||
                error.message ||
                "Setup failed"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="setup-container">
            <div className="setup-card">
                <h2 className="setup-title">Complete Your Setup</h2>
                <p className="setup-subtitle">
                    Choose a unique username and create a secure 6-digit PIN.
                </p>

                <form className="setup-form" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="Username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            placeholder="Create 6-digit PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value)}
                        />
                    </div>

                    <button
                        className="setup-btn"
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? "Setting Up..." : "Complete Setup"}
                    </button>

                </form>
            </div>
        </div>
    );
}

export default SetUp;