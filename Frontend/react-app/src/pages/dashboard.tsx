import React from "react";
import TopBar from "../components/TopBar";
import Calendar from "../components/Calendar";
import ShoppingList from "../components/ShoppingList";
import MealPlan from "../components/MealPlan";
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
          <ShoppingList />
        </div>
        <MealPlan />
      </div>
    </div>
  );
};

export default Dashboard;
