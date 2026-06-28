import "./EditProfile.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function EditProfile({ user, fetchCurrentUser}) {

    const [name, setName] = useState(user.name);
    const [userName, setUserName] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const navigate = useNavigate();

    const handleEdit = async(e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("token");
            const responce = await axios.patch(
                `${import.meta.env.VITE_API_URL}/user/edit`,
                {
                    name: name,
                    username: userName,
                    bio: bio
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchCurrentUser();

            navigate('/profile');

        }catch(error){
            return alert("username Exist");
            console.log(error);
        }
    }



    return (
<div className="edit-profile-page">

    <div className="edit-profile-card">

        <h2>Edit Profile</h2>

        <p>
            Update your public information visible to other users.
        </p>

        <form
            className="edit-profile-form"
            onSubmit={handleEdit}
        >

            <div className="edit-form-group">

                <label htmlFor="name">
                    Name
                </label>

                <input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e)=>setName(e.target.value)}
                />

            </div>

            <div className="edit-form-group">

                <label htmlFor="username">
                    Username
                </label>

                <input
                    id="username"
                    type="text"
                    value={userName}
                    onChange={(e)=>setUserName(e.target.value)}
                />

            </div>

            <div className="edit-form-group">

                <label htmlFor="bio">
                    Bio
                </label>

                <textarea
                    id="bio"
                    rows="4"
                    value={bio}
                    onChange={(e)=>setBio(e.target.value)}
                />

            </div>

            <button
                className="edit-profile-btn"
                type="submit"
            >
                Save Changes
            </button>

        </form>

    </div>

</div>
    )
}