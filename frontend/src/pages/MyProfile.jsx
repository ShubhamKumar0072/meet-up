import "./MyProfile.css";
import {
    Mail,
    User,
    ShieldCheck,
    CalendarDays
} from "lucide-react";

import { Link } from "react-router-dom";

export default function MyProfile({ user }) {

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

                        <Mail size={20}/>

                        <div>
                            <span>Email</span>
                            <p>{user.email}</p>
                        </div>

                    </div>

                    <div className="profile-row">

                        <User size={20}/>

                        <div>
                            <span>Username</span>
                            <p>@{user.username}</p>
                        </div>

                    </div>

                    <div className="profile-row">

                        <ShieldCheck size={20}/>

                        <div>
                            <span>Security</span>

                            <p>
                                {
                                    user.isSetupComplete
                                    ? "End-to-End Encryption Enabled"
                                    : "Encryption Not Configured. SetUp PIN to Enable It"
                                }
                            </p>

                        </div>

                    </div>

                    <div className="profile-row">

                        <CalendarDays size={20}/>

                        <div>

                            <span>Joined</span>

                            <p>
                                {
                                    new Date(user.createdAt)
                                    .toLocaleDateString("en-US",{
                                        day:"numeric",
                                        month:"long",
                                        year:"numeric"
                                    })
                                }
                            </p>

                        </div>

                    </div>

                </div>

                <Link to="/profile/edit">
                    <button className="profile-edit-btn">
                        Edit Profile
                    </button>               
                </Link>



            </div>

        </div>

    );

}