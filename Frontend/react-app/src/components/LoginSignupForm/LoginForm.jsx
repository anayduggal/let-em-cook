import React, { useState } from "react";
import "./LoginForm.css";

const LoginForm = ({ type }) => {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    psw: "",
    psw2: "", // Only for signup
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(`${type} form submitted:`, formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="imgcontainer">
        <h1>{type === "signup" ? "Sign Up" : "Login"}</h1>
        <img src="img_avatar2.png" alt="Avatar" className="avatar" />
      </div>

      <div className="container">
        {/* Signup: First & Last Name Fields */}
        {type === "signup" && (
          <>
            <label htmlFor="fname"><b>First Name</b></label>
            <input
              type="text"
              placeholder="First Name"
              name="fname"
              value={formData.fname}
              onChange={handleChange}
              required
            />

            <label htmlFor="lname"><b>Last Name</b></label>
            <input
              type="text"
              placeholder="Last Name"
              name="lname"
              value={formData.lname}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Common Fields (Email & Password) */}
        <label htmlFor="email"><b>Email</b></label>
        <input
          type="email"
          placeholder="Enter email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="psw"><b>Password</b></label>
        <input
          type="password"
          placeholder="Enter Password"
          name="psw"
          value={formData.psw}
          onChange={handleChange}
          required
        />

        {/* Signup: Confirm Password */}
        {type === "signup" && (
          <>
            <label htmlFor="psw2"><b>Confirm Password</b></label>
            <input
              type="password"
              placeholder="Confirm Password"
              name="psw2"
              value={formData.psw2}
              onChange={handleChange}
              required
            />
          </>
        )}

        {/* Submit Button */}
        <button type="submit">{type === "signup" ? "Sign Up" : "Login"}</button>

        {/* Login: Remember Me */}
        {type === "login" && (
          <label>
            <input type="checkbox" name="remember" /> Remember me
          </label>
        )}
      </div>

      <div className="container" style={{ backgroundColor: "#f1f1f1" }}>
        <button type="button" className="cancelbtn">Cancel</button>
        {type === "login" && <span className="psw"><a href="#">Forgot password?</a></span>}
      </div>

      <div className="register-link">
        {type === "signup" ? (
          <p>Already have an account? <a href="#">Login</a></p>
        ) : (
          <p>Don't have an account? <a href="#">Sign Up</a></p>
        )}
      </div>
    </form>
  );
};

export default LoginForm;
