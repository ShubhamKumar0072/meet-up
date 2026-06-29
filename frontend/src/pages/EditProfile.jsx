import "./EditProfile.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function EditProfile({ user, fetchCurrentUser }) {

    const [name, setName] = useState(user.name);
    const [userName, setUserName] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [profilePic, setProfilePic] = useState(null);
    const navigate = useNavigate();

    const handleEdit = async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("username", userName);
            formData.append("bio", bio);
            if (profilePic) {
                formData.append("profilePic", profilePic);
            }

            const token = localStorage.getItem("token");
            const responce = await axios.patch(
                `${import.meta.env.VITE_API_URL}/user/edit`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            await fetchCurrentUser();

            navigate('/profile');

        } catch (error) {
            return alert("username Exist");
            console.log(error);
        }
    }

    const handleProfilePicChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {
            alert("Only JPG, PNG, and WEBP images are allowed.");
            e.target.value = "";
            setProfilePic(null);
            return;
        }

        if (file.size > 1024 * 1024) {
            alert("Profile picture must be smaller than 1 MB.");
            e.target.value = "";
            setProfilePic(null);
            return;
        }

        setProfilePic(file);
    };



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
                            onChange={(e) => setName(e.target.value)}
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
                            onChange={(e) => setUserName(e.target.value)}
                        />

                    </div>

                    <div className="edit-form-group">

                        <label htmlFor="profilePic">
                            New Profile Picture ( Less then 1 MB )
                        </label>

                        <input
                            id="profilePic"
                            type="file"
                            accept="image/*"
                            onChange={handleProfilePicChange}
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
                            onChange={(e) => setBio(e.target.value)}
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