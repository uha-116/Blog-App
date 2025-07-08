import { useState,useEffect } from "react"; // useState: Handles local component state (form flips, error messages)
import { Link, useNavigate,useLocation} from "react-router-dom"; // Link: Enables navigation via clickable links; useNavigate: Redirects programmatically
import axios from "axios"; // axios: Sends HTTP requests to the backend (e.g., POST for signup/login)
import "./Signup.css"; // Imports styles for forms, animations, and layouts
import { useDispatch} from "react-redux";
import { user_author_thunk } from "../redux/slices/userauthorslice";



export default function SignupLoginForm() {
  const [isFlipped, setIsFlipped] = useState(false); // Manages flip state: false (show signup), true (show login)
  const [err, setErr] = useState(""); // Stores error messages for user feedback
  const navigate = useNavigate(); // Hook for programmatic navigation
  const dispatch = useDispatch();
  const location = useLocation(); // 🆕 Get location state

  /*
    handleSignup - Handles signup form submission
    Steps:
    1️⃣ Prevents page reload on submit
    2️⃣ Collects user input from the form (usertype, username, password, email)
    3️⃣ Sends user data to the backend for registration
    4️⃣ On successful registration: redirects directly to the user profile (no extra login step needed)
    5️⃣ On error: displays server-provided or generic error messages
  */
  // 🚀 Show login form if "showLogin" state is passed
  useEffect(() => {
    if (location.state?.showLogin) {
      setIsFlipped(true); // Flip to login form
    }
  }, [location.state]);
  const handleSignup = async (e) => {
    e.preventDefault(); // Stops page from refreshing

    const formData = {
      action: "register",
      usertype: document.querySelector('input[name="usertype"]:checked')?.value || "", // Get selected user type (User or Author)
      username: e.target.username.value, // Get username input value
      password: e.target.password.value, // Get password input value
      email: e.target.email.value,       // Get email input value
    };
    await dispatch(user_author_thunk(formData));
    const endpoint = formData.usertype === "User" ? "userapi/newuser" : "authorapi/newuser"; // Choose correct API endpoint

    try {
      const res = await axios.post(`http://localhost:2000/${endpoint}`, formData); // Send data to backend

      if (res.data.mssg === "User loginned" || res.data.mssg === "author loginned") {
        // ✅ Successful signup: redirect directly to profile/articles page
        navigate(formData.usertype === "Author" ? "/authorarticles" : "/userarticles");
      } else {
        setErr(res.data.mssg); // ⚠️ Show server error (e.g., username taken)
      }
    } catch (error) {
      setErr("Error occurred during signup."); // ❌ Network or server error
    }
  };

  /*
    handleLogin - Handles login form submission with validation
    Steps:
    1️⃣ Prevents default form submission
    2️⃣ Collects user credentials (usertype, username, password)
    3️⃣ Sends data to backend for authentication
    4️⃣ On success: redirects to profile/articles page
    5️⃣ On failure: displays error messages (e.g., incorrect password)
  */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents page reload

    const formData = {
      action: "login",
      usertype: document.querySelector('input[name="usertype"]:checked')?.value || "",
      username: e.target.username.value,
      password: e.target.password.value,
    };
    await dispatch(user_author_thunk(formData));
    const endpoint = formData.usertype === "User" ? "userapi/login" : "authorapi/login"; // Set endpoint based on user type

    try {
      const res = await axios.post(`http://localhost:2000/${endpoint}`, formData); // Send login request
      
      if (res.data.mssg === "author loginned" || res.data.mssg === "User loginned") {
        // ✅ Login successful: redirect to appropriate page
        navigate(formData.usertype === "Author" ? "/authorarticles" : "/userarticles");
      } else {
        setErr(res.data.mssg); // ⚠️ Show login error from server
      }
    } catch (error) {
      setErr("Error occurred during login."); // ❌ Network/server error
    }
  };

  return (
    <div className="container">
    <div className="d-flex justify-content-end">
      <div className="form-container">
        <div className={`form-card ${isFlipped ? "flipped" : ""}`}>
          {/* Front Face: Signup Form */}
          <div className="form-face front">
            <form onSubmit={handleSignup} className="signup-form">
              {err && <p className="error">{err}</p>}
              <h2 className="title">Register</h2>

              <div className="radio-group">
                <label><input type="radio" name="usertype" value="User" /> User</label>
                <label><input type="radio" name="usertype" value="Author" /> Author</label>
              </div>

              <input type="text" name="username" placeholder="Username" className="form-control mb-2" required />
              <input type="password" name="password" placeholder="Password" className="form-control mb-2" required />
              <input type="email" name="email" placeholder="Email" className="form-control mb-2" required />

              <Link onClick={() => setIsFlipped(true)} className="toggle-link">Already Registered? Login here</Link>
              <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#001f7f" }}>Submit</button>
            </form>
          </div>

          {/* Back Face: Login Form */}
          <div className="form-face back">
            <form onSubmit={handleLogin} className="signup-form">
              {err && <p className="error">{err}</p>}
              <h2 className="title">Login</h2>

              <div className="radio-group">
                <label><input type="radio" name="usertype" value="User" /> User</label>
                <label><input type="radio" name="usertype" value="Author" /> Author</label>
              </div>

              <input type="text" name="username" placeholder="Username" className="form-control mb-2" required />
              <input type="password" name="password" placeholder="Password" className="form-control mb-3" required />

              <Link onClick={() => setIsFlipped(false)} className="toggle-link">New here? Register</Link>
              <button type="submit" className="btn w-100 text-white" style={{ backgroundColor: "#001f7f" }}>Submit</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
