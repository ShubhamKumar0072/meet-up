import "./Navbar.css";
import { Link } from "react-router-dom";
export default function Navbar(){
    return (
        <div className="Navbar">
            <h1 className="logo">MeetUp</h1>
            <form action="">
                <input className="search" type="text" placeholder="Search Chat" />
            </form>


            <div className="chat-list">
                <Link to="/Home/chatpage"><div className="chat-item">Chat Name</div></Link>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name</div>
                <div className="chat-item">Chat Name65</div>
                <div className="chat-item">Chat Name65</div>
                <div className="chat-item">Chat Name65</div>
                <div className="chat-item">Chat Name65</div>
            </div>

            <div className="my-profile">
                <Link to="/Home/profile"><p>Shubham Kumar</p></Link>
                <Link to="/Home/setting"><button>Settings</button></Link>
            </div>
        </div>
    )
}