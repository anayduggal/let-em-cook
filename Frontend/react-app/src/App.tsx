import HomePage from "./pages/homepage";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import LoginSignupForm from "./components/LoginSignupForm/LoginSignupForm";
import React from "react";
import Routes from "./Routes";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <div>
      {/* <LoginForm type="signup" /> */}
      <HomePage />
    </div>
  );
}

export default App;
