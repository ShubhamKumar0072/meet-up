import "./Navbar.css";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";


export default function Navbar({user}){

    const[conversations,setConversations] = useState([]);

    useEffect(()=>{
        const fetchConversations = async()=>{
            try{
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
                setConversations(response.data);
            }catch(error){
                console.log(error);
            }
        };
        fetchConversations();
    },[])

    //console.log(conversations);
    return (
        <div className="Navbar">
            <h1 className="logo">MeetUp</h1>
            <form action="">
                <input className="search" type="text" placeholder="Search Chat" />
            </form>


            <div className="chat-list">

                {conversations.map((conversation)=>{

                    const otheruser = conversation.participants.find(
                        participant => participant._id !== user.id
                    );

                    //console.log("other user : ",otheruser);

                    return(
                    <Link to={`/chat/${conversation._id}`} key={conversation._id} state={{conversation}}>
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