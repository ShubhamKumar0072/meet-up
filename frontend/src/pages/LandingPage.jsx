import "./LandingPage.css";

export default function LandingPage() {

    const handelGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return (
        <div className="LandingPage">

            <section className="hero">

                <div className="heroText">

                    <span className="logo">
                        💬 MeetUp
                    </span>

                    <h1>
                        Private conversations,
                        built for everyone.
                    </h1>

                    <p>
                        MeetUp is a secure messaging platform designed for
                        people who value privacy. Chat instantly, stay
                        connected across devices, and keep every conversation
                        protected.
                    </p>

                    <div className="highlights">
                        <div>🔒 End-to-End Encrypted</div>
                        <div>⚡ Instant Messaging</div>
                        <div>☁️ Secure Cloud Sync</div>
                        <div>🛡 Privacy First</div>
                    </div>

                </div>

                <div className="loginCard">

                    <h2>Welcome 👋</h2>

                    <p>
                        Continue with Google to start chatting securely.
                    </p>

                    <button
                        className="googleButton"
                        onClick={handelGoogleLogin}
                    >
                        <img
                            src="https://www.svgrepo.com/show/475656/google-color.svg"
                            alt="Google"
                        />

                        Continue with Google
                    </button>

                    <small>
                        By continuing you agree to our Terms &
                        Privacy Policy.
                    </small>

                </div>

            </section>

            <section className="features">

                <div className="feature">

                    <h3>🔒 Secure</h3>

                    <p>
                        Your messages are encrypted before they leave
                        your device.
                    </p>

                </div>

                <div className="feature">

                    <h3>⚡ Fast</h3>

                    <p>
                        Real-time messaging with instant delivery and
                        notifications.
                    </p>

                </div>

                <div className="feature">

                    <h3>☁️ Synced</h3>

                    <p>
                        Access your conversations securely from all
                        your devices.
                    </p>

                </div>

                <div className="feature">

                    <h3>🛡 Private</h3>

                    <p>
                        We don't sell your data or show intrusive ads.
                    </p>

                </div>

            </section>

        </div>
    );
}