import {
    Mail,
    User,
    ShieldCheck,
    CalendarDays
} from "lucide-react";

import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Profile() {

    const { id } = useParams();

    const [user, setUser] = useState(null);

    const fetchUserById = async (userId) => {
        const token = localStorage.getItem("token");

        const response = await axios.get(
            `${import.meta.env.VITE_API_URL}/user/${userId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        return response.data;
    };

    useEffect(() => {
        const loadUser = async () => {
            try {
                const data = await fetchUserById(id);
                setUser(data);
            } catch (error) {
                console.log(error);
            }
        };

        loadUser();
    }, [id]);


if(!user) return <div>Loading...</div>

    return (
        <div className="profile-page">

            <div className="profile-card">

                <img
                    className="profile-avatar"
                    src={user.profilePic}
                    alt={user.name}
                />

                <h2>{user.name}</h2>

                <h4>@{user.username}</h4>

                <p className="profile-bio">
                    {user.bio}
                </p>

                <div className="profile-info">

                    <div className="profile-row">

                        <User size={20} />

                        <div>
                            <span>Username</span>
                            <p>@{user.username}</p>
                        </div>

                    </div>

                    <div className="profile-row">

                        <ShieldCheck size={20} />

                        <div>
                            <span>Security</span>

                            <p>
                                {
                                    user.isSetupComplete
                                        ? "End-to-End Encryption Enabled"
                                        : "Encryption Not Configured"
                                }
                            </p>

                        </div>

                    </div>

                    <div className="profile-row">

                        <CalendarDays size={20} />

                        <div>

                            <span>Joined</span>

                            <p>
                                {
                                    new Date(user.createdAt)
                                        .toLocaleDateString("en-US", {
                                            day: "numeric",
                                            month: "long",
                                            year: "numeric"
                                        })
                                }
                            </p>

                        </div>

                    </div>

                </div>


            </div>

        </div>
    )
}