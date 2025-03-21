import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginForm.css";
import { Link } from "react-router-dom";

type LoginFormProps = {
  type: "login" | "signup";
};

type FormData = {
  fname?: string;
  lname?: string;
  email: string;
  psw: string;
  psw2?: string; // Only for signup
};

const LoginForm: React.FC<LoginFormProps> = ({ type }) => {
  const [formData, setFormData] = useState<FormData>({
    fname: "",
    lname: "",
    email: "",
    psw: "",
    psw2: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`${type} form submitted:`, formData);
  };

  return (
    <div className="form-wrapper">
      <form onSubmit={handleSubmit} className="login-form">
        <h1>{type === "signup" ? "Sign Up" : "Login"}</h1>
        <div className="input-group">
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
        </div>
        <button type="submit" className="submit-btn">
          {type === "signup" ? "Sign Up" : "Login"}
        </button>
        <div className="form-footer">
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
      <div className="right-section">
        <img src="login_food.jpg" alt="Chef preparing food" />
      </div>

    </div>
  );
};

export default LoginForm;
