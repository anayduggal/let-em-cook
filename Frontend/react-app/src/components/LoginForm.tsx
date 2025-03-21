import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginForm.css";
import { Link, useNavigate } from "react-router-dom";
import imageSrc from "../assets/image.png";

interface LoginFormProps {
  type: "login" | "signup";
}

// Holds the data currently in the login/signup form
type FormData = {
  fname: string; // Only for signup
  lname: string; // Only for signup
  email: string;
  psw: string;
  psw2?: string; // Only for signup
};

// Includes the data needed for a login request
type LoginData = {
  action_type: "login";
  email: string;
  password: string;
};

// Includes the data needed for signup request
type SignupData = {
  action_type: "signup";
  email: string;
  password: string;
  first_name: string;
  last_name: string;
};

// The result recieved after a login request
type LoginResult = "success" | "user does not exist" | "password incorrect";

// The result recieved after a signup request
type SignupResult = "success" | "duplicate email";

const extractLoginData = (data: FormData): LoginData => {
  // Convert FormData to LoginData

  return {
    action_type: "login",
    email: data.email,
    password: data.psw,
  };
};

const extractSignupData = (data: FormData): SignupData => {
  // Convert FormData to SignupData

  return {
    action_type: "signup",
    email: data.email,
    password: data.psw,
    first_name: data.fname,
    last_name: data.lname,
  };
};

const sendLoginRequest = async (form_data: FormData): Promise<LoginResult> => {
  // Send POST request to server
  const response = await fetch("http://localhost:8000/index.php/login", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(extractLoginData(form_data)), // Extract login data from form
  });

  // Check for bad response status
  if (!response.ok) throw new Error(`Response failed`);

  let response_json = await response.json();

  return response_json["result"];
};

const sendSignupRequest = async (
  form_data: FormData
): Promise<SignupResult> => {
  console.log(
    `Sending POST request: ${JSON.stringify(extractSignupData(form_data))}`
  );

  // Send POST request to server
  const response = await fetch("http://localhost:8000/index.php/signup", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(extractSignupData(form_data)), // Extract signup data from form
  });

  // Check for bad response status
  if (!response.ok) throw new Error(`Response failed`);

  let response_json = await response.json();

  return response_json["result"];
};

const LoginForm: React.FC<LoginFormProps> = ({ type }) => {
  // Used for login and signup forms

  // Initialize form data
  const [formData, setFormData] = useState<FormData>({
    fname: "",
    lname: "",
    email: "",
    psw: "",
    psw2: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null); // Error message state
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Keep current form data the same, update the value that changed

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null); // Reset error message
    setSuccess(null); // Reset success message

    if (type == "login") {
      // Send login request to server
      let result = await sendLoginRequest(formData);

      // TODO: Handle result
      switch (result) {
        case "success":
          console.log("Successfully logged in");
          localStorage.setItem("token", "user_token_here"); // Store token
          navigate("/profile"); // Redirect to profile page
          break;

        case "password incorrect":
          console.log("Password incorrect");
          setError("Password incorrect");
          break;

        case "user does not exist":
          console.log("Email not associated with user");
          setError("No account found");
          break;
      }
    } else if (type == "signup") {
      // Check passwords match
      if (formData.psw != formData.psw2) {
        setError("Passwords do not match");
        return;
      }

      // Send signup request to server
      let result = await sendSignupRequest(formData);

      // TODO: Handle result
      switch (result) {
        case "success":
          console.log("Successfully signed up");
          setTimeout(() => navigate("/login"), 2000);
          break;
        case "duplicate email":
          setError("User with that email already exists");
          break;
      }
    }
  };

  return (
    <div className="container">
      <div className="left">
        <form onSubmit={handleSubmit} className="form-box">
          <h1>{type === "signup" ? "Get Cooking Now" : "Welcome back!"}</h1>

          {type === "signup" && (
            <>
              <input
                type="text"
                placeholder="First Name"
                name="fname"
                value={formData.fname || ""}
                onChange={handleChange}
                required
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lname"
                value={formData.lname || ""}
                onChange={handleChange}
                required
              />
            </>
          )}
          <input
            type="email"
            placeholder="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            name="psw"
            value={formData.psw}
            onChange={handleChange}
            required
          />
          {type === "signup" && (
            <input
              type="password"
              placeholder="Confirm Password"
              name="psw2"
              value={formData.psw2 || ""}
              onChange={handleChange}
              required
            />
          )}

          {type === "login" && (
            <label className="remember-me">
              <input type="checkbox" /> Remember me
            </label>
          )}

          <button type="submit" className="submit-btn">
            {type === "signup" ? "Sign Up" : "Login"}
          </button>

          <div className="form-footer">
            <button
              type="button"
              className="cancel-btn"
              onClick={() => navigate("/")}
            >
              Cancel
            </button>
            {type === "login" && (
              <a href="#" className="forgot">
                Forgot password?
              </a>
            )}
          </div>

          <p className="switch-form">
            {type === "signup"
              ? "Already have an account? "
              : "Don't have an account? "}
            <Link to={type === "signup" ? "/login" : "/signup"}>
              {type === "signup" ? "Login" : "Sign Up"}
            </Link>
          </p>
        </form>
      </div>

      <div className="right">
        <img src={imageSrc} alt="Cooking" />
      </div>
    </div>
  );
};

export default LoginForm;
