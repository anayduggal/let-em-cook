import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginForm.css";
import { Link } from "react-router-dom";
<<<<<<< HEAD
import { useQuery } from "@tanstack/react-query";
=======
import imageSrc from "../assets/image.png";
>>>>>>> origin/main

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

// Includes the data needed for a login request
type LoginData = {
  action_type: "login",
  email: string,
  password: string,
};

// Includes the data needed for signup request
type SignupData = {
  action_type: "signup",
  email: string,
  password: string,
  first_name: string,
  last_name: string
}

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

const loginRequest = async (request_data: FormData): Promise<any> => {  
  // print response
  console.log(JSON.stringify(extractLoginData(request_data)));

  // Send POST request to server
  const response = await fetch("http://localhost:8000/index.php/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(extractLoginData(request_data))  // Extract login data from form
    }
  );

  // Log all headers
  console.log("Response Headers:");
  response.headers.forEach((value, name) => {
    console.log(`${name}: ${value}`);
  });

  // Log status
  console.log(`Status: ${response.status}`)

  if (!response.ok) throw new Error(`Response failed`);

  return response.json();
};

const signupRequest = async (request_data: FormData): Promise<any> => {
  // Send POST request to server
  const response = await fetch("http://localhost:8000/index.php/signup", {
      mode: "no-cors",
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify(extractSignupData(request_data))  // Extract signup data from form
    }
  );

  // Check response is OK
  if (!response.ok) throw new Error("Failed to fetch");

  return response;
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

      let request_data = await loginRequest(formData);

      if (request_data["error"]) {
        console.log(`Could not log in: ${request_data["error"]}`)
      } else {
        console.log("Successfully logged in")
      }

    } else if (type == "signup") {
      // Send signup request to server

      let request_data = await signupRequest(formData);

      if (request_data["error"]) {
        console.log(`Could not create user: ${request_data["error"]}`)
      } else {
        console.log("Successfully created user")
      }

    } else {
      // Invalid form type

      console.log(`Could not submit form, bad LoginForm type: ${type}`);

      let request_data = null;

    }

    console.log(`${type} form submitted:`, formData);
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
