import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Signup.css";
import { useDispatch, useSelector } from "react-redux";
import { setAuthError, user_author_thunk } from "../redux/slices/userauthorslice";

export default function SignupLoginForm() {
  const [isFlipped, setIsFlipped] = useState(false);
  const [submittedUsertype, setSubmittedUsertype] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const { loginstatus, errorOccured, errMsg, currentuser } = useSelector(
    (state) => state.userauthorlogin
  );

  useEffect(() => {
    dispatch(setAuthError(null));
  }, [dispatch]);

  useEffect(() => {
    if (location.state?.showLogin) {
      setIsFlipped(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (!loginstatus) return;
    const userType = submittedUsertype || currentuser?.usertype;
    navigate(userType === "Author" ? "/authorarticles" : "/userarticles");
  }, [loginstatus, submittedUsertype, currentuser, navigate]);

  const handleSignup = async (e) => {
    e.preventDefault();

    const formData = {
      action: "register",
      usertype:
        document.querySelector('input[name="usertype"]:checked')?.value || "",
      username: e.target.username.value,
      password: e.target.password.value,
      email: e.target.email.value,
    };

    setSubmittedUsertype(formData.usertype);
    await dispatch(user_author_thunk(formData));
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    const formData = {
      action: "login",
      usertype:
        document.querySelector('input[name="usertype"]:checked')?.value || "",
      username: e.target.username.value,
      password: e.target.password.value,
    };

    setSubmittedUsertype(formData.usertype);
    await dispatch(user_author_thunk(formData));
  };

  return (
    <div className="container">
      <div className="d-flex justify-content-end">
        <div className="form-container">
          <div className={`form-card ${isFlipped ? "flipped" : ""}`}>
            <div className="form-face front">
              <form onSubmit={handleSignup} className="signup-form">
                {errorOccured && errMsg && <p className="error">{errMsg}</p>}
                <h2 className="title">Register</h2>

                <div className="radio-group">
                  <label>
                    <input type="radio" name="usertype" value="User" /> User
                  </label>
                  <label>
                    <input type="radio" name="usertype" value="Author" />{" "}
                    Author
                  </label>
                </div>

                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="form-control mb-2"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control mb-2"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control mb-2"
                  required
                />

                <Link onClick={() => setIsFlipped(true)} className="toggle-link">
                  Already Registered? Login here
                </Link>
                <button
                  type="submit"
                  className="btn w-100 text-white"
                  style={{ backgroundColor: "#001f7f" }}
                >
                  Submit
                </button>
              </form>
            </div>

            <div className="form-face back">
              <form onSubmit={handleLogin} className="signup-form">
                {errorOccured && errMsg && <p className="error">{errMsg}</p>}
                <h2 className="title">Login</h2>

                <div className="radio-group">
                  <label>
                    <input type="radio" name="usertype" value="User" /> User
                  </label>
                  <label>
                    <input type="radio" name="usertype" value="Author" />{" "}
                    Author
                  </label>
                </div>

                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="form-control mb-2"
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="form-control mb-3"
                  required
                />

                <Link onClick={() => setIsFlipped(false)} className="toggle-link">
                  New here? Register
                </Link>
                <button
                  type="submit"
                  className="btn w-100 text-white"
                  style={{ backgroundColor: "#001f7f" }}
                >
                  Submit
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
