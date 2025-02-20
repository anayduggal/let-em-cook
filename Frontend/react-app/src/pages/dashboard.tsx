import React from "react";
import TopBar from "../components/TopBar";
import Calendar from "../components/Calendar";
import ShoppingList from "../components/ShoppingList";
import MealPlan from "../components/MealPlan";
import "../pages/dashboard.css";

const Dashboard: React.FC = () => {
  return (
    <div className="dashboard-container">
      <TopBar className="top-bar" />
      <div className="dashboard-content">
        <Calendar className="dashboard-calendar" />
        <ShoppingList className="dashboard-shopping-list" />
      </div>
      <MealPlan className="dashboard-meal-plan" />
    </div>
  );
};

export default Dashboard;
