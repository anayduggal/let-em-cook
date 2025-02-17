import React, { useState, ChangeEvent, FormEvent } from "react";
import "./LoginForm.css";

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
        {type === "login" && (
          <label className="remember-me">
            <input type="checkbox" name="remember" /> Remember me
          </label>
        )}
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
          <a href="#">{type === "signup" ? "Login" : "Sign Up"}</a>
        </p>
      </form>
    </div>
  );
};

export default LoginForm;
