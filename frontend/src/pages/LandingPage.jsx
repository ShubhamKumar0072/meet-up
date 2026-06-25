export default function LandingPage(){
    const handelGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_API_URL}/auth/google`;
    };

    return(
        <div className="LandingPage">
            <h1>Welcome to Meet Up. here your journy starts. </h1>
            <button onClick={handelGoogleLogin}>
                Continue with Google
            </button>
        </div>
    )
}