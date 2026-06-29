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

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    const pinRegex = /^\d{6}$/;

    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        // 🔐 validation
        if (!usernameRegex.test(username)) {
            setError("Username must be 3–20 characters (letters, numbers, _ only)");
            return;
        }

        if (!pinRegex.test(pin)) {
            setError("PIN must be exactly 6 digits");
            return;
        }

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

            setError(
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

                {error && (
                    <div className="setup-error">
                        {error}
                    </div>
                )}

                <form className="setup-form" onSubmit={handleSubmit}>

                    <div className="input-group">
                        <input
                            type="text"
                            placeholder="admin_123"
                            value={username}
                            onChange={(e) => setUsername(e.target.value.toLowerCase())}
                        />
                    </div>

                    <div className="input-group">
                        <input
                            type="password"
                            inputMode="numeric"
                            maxLength={6}
                            placeholder="6-digit PIN"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
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