import React from "react";
import TopBar from "../components/TopBar";
import Calendar from "../calendar/Calendar";
import ShoppingList from "../components/ShoppingList";
import MealPlan from "../components/MealPlan";
import Pantry from "../components/Pantry"
import "../pages/dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div>
      <TopBar
        onLoginClick={() => {
          /* handle login click */
        }}
      />
      <div className="dashboard-container">
        <div className="dashboard-content">
          <Calendar />
          <Pantry />
          <ShoppingList />
        </div>
        <MealPlan />
      </div>
    </div>
  );
};

export default Dashboard;
