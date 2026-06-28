import "./UserManual.css";
import {
    BookOpen,
    UserPlus,
    ShieldCheck,
    MessageCircle,
    KeyRound,
    Lightbulb
} from "lucide-react";

export default function UserManual() {

    return (

        <div className="manual-page">

            <div className="manual-header">

                <BookOpen size={60}/>

                <h1>MeetUp User Manual</h1>

                <p>
                    Welcome to MeetUp! This guide will help you understand
                    how to use the application securely and get the most out
                    of private conversations.
                </p>

            </div>

            <div className="manual-section">

                <UserPlus size={28}/>

                <div>

                    <h2>Getting Started</h2>

                    <p>
                        Sign in using your Google account. During the first
                        setup you'll create a unique username and a secure
                        PIN. Other users can find you using your username
                        and start a conversation instantly.
                    </p>

                </div>

            </div>

            <div className="manual-section">

                <ShieldCheck size={28}/>

                <div>

                    <h2>Security & Encryption</h2>

                    <p>
                        Every conversation is protected using AES encryption
                        together with RSA public/private key encryption.
                        Messages are encrypted before they leave your device
                        and can only be decrypted by the intended recipient.
                    </p>

                </div>

            </div>

            <div className="manual-section">

                <MessageCircle size={28}/>

                <div>

                    <h2>How Conversations Work</h2>

                    <p>
                        Search for another user using their username and
                        start chatting. Messages are encrypted automatically,
                        so you can focus on the conversation while MeetUp
                        handles the security in the background.
                    </p>

                </div>

            </div>

            <div className="manual-section warning">

                <KeyRound size={28}/>

                <div>

                    <h2>Important: Keep Your PIN Safe</h2>

                    <p>
                        Your PIN unlocks your encrypted private key. MeetUp
                        never stores or knows your PIN. If you forget it,
                        your private key cannot be recovered and your
                        existing encrypted conversations become inaccessible.
                    </p>

                    <p className="warning-text">
                        The only option is to permanently delete your account
                        and create a new one.
                    </p>

                </div>

            </div>

            <div className="manual-section">

                <Lightbulb size={28}/>

                <div>

                    <h2>Tips</h2>

                    <ul>

                        <li>Choose a strong PIN that you can remember.</li>

                        <li>Never share your PIN with anyone.</li>

                        <li>Share your username with friends to connect.</li>

                        <li>Keep your profile information updated.</li>

                        <li>Always log out when using a shared device.</li>

                    </ul>

                </div>

            </div>

        </div>

    );

}