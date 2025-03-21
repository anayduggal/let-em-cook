import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginForm.css";
import { Link } from "react-router-dom";
import imageSrc from "../assets/image.png";
import { sendLoginRequest, sendSignupRequest, LoginData, SignupData } from "../api/userService";

interface LoginFormProps {
  type: "login" | "signup";
};

// Holds the data currently in the login/signup form
type FormData = {
  fname: string; // Only for signup
  lname: string; // Only for signup
  email: string;
  psw: string;
  psw2?: string; // Only for signup
};

const extractLoginData = (data: FormData): LoginData => {
  // Convert FormData to LoginData

  return {
    action_type: "login",
    email: data.email,
    password: data.psw
  };
};

const extractSignupData = (data: FormData): SignupData => {
  // Convert FormData to SignupData

  return {
    action_type: "signup",
    email: data.email,
    password: data.psw,
    first_name: data.fname,
    last_name: data.lname
  };
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

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Keep current form data the same, update the value that changed

    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (type == "login") {
      // Send login request to server
      const loginData = extractLoginData(formData)
      const result = await sendLoginRequest(loginData);

      // TODO: Handle result
      switch (result) {
        case "success":
          console.log("Successfully logged in");
          break;
        
        case "password incorrect":
          console.log("Password incorrect");
          break;
        
        case "user does not exist":
          console.log("Email not associated with user");
          break;
      }

    } else if (type == "signup") {
      // Check passwords match
      if (formData.psw != formData.psw2) {
        // TODO: tell user to make passwords match
      };

      // Send signup request to server
      const signupData = extractSignupData(formData)
      const result = await sendSignupRequest(signupData);

      // TODO: Handle result
      switch (result) {
        case "success":
          console.log("Successfully signed up");
          break;
        case "duplicate email":
          console.log("User with that email already exists");
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
            <button type="button" className="cancel-btn">
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
