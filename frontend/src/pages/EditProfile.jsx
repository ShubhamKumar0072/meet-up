import "./EditProfile.css";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";



export default function EditProfile({ user, fetchCurrentUser }) {

    const [name, setName] = useState(user.name);
    const [userName, setUserName] = useState(user.username);
    const [bio, setBio] = useState(user.bio);
    const [profilePic, setProfilePic] = useState(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

    const NAME_MIN = 2;
    const NAME_MAX = 30;

    const BIO_MAX = 150;

    const handleEdit = async (e) => {
        e.preventDefault();
        setError("");

        //name Validation
        if (!name || name.trim().length < NAME_MIN || name.trim().length > NAME_MAX) {
            setError(`Name must be between ${NAME_MIN} and ${NAME_MAX} characters`);
            return;
        }

        //username validation
        if (!usernameRegex.test(userName)) {
            setError("Username must be 3–20 chars (letters, numbers, _ only)");
            return;
        }

        //bio validation
        if (bio && bio.length > BIO_MAX) {
            setError(`Bio cannot exceed ${BIO_MAX} characters`);
            return;
        }

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
            setError(
                error.response?.data?.message ||
                "Update failed"
            );
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

                {error && (
                    <div className="edit-error">
                        {error}
                    </div>
                )}

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
                            maxLength={NAME_MAX}
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
                            onChange={(e) => setUserName(e.target.value.toLowerCase())}
                            maxLength={20}
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
                            maxLength={BIO_MAX}
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