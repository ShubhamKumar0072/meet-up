import "./Empty.css";
import { MessageCircleMore, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Empty() {
    const navigate = useNavigate();

    const handelClick = ()=>{
        navigate("/user-manual");
    }

    return (

        <div className="empty">

            <div className="empty-icon">
                <MessageCircleMore size={90} />
            </div>

            <h1>
                Select a conversation
            </h1>

            <p>
                Choose a chat from the sidebar or start a new one to
                begin your secure conversation.
            </p>

            <button className="empty-btn" onClick={handelClick}>
                <BookOpen size={18} />
                User Manual
            </button>

        </div>

    );
}