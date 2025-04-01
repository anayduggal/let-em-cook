import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Calendar.css';

import {
  RecipeData,
  getUserRecipes
} from "../api/recipeService";

interface Day {
  date: Date;
  events: RecipeData[];
}

const Calendar: React.FC = () => {

  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [daysInMonth, setDaysInMonth] = useState<Day[]>([]);
  const [meals, setMeals] = useState<RecipeData[]>([
    { recipe_id: 1, cook_date: new Date("2025-03-05"), recipe_name: "Sandwich", source_link: "https://example.com/sandwich" },
  ]);

  useEffect(() => {
    const getUsersRecipes = async () => {
      try {
        const recipesData = await getUserRecipes();
        console.log(recipesData);

        setMeals((prevMeals) => {
          const newRecipes = recipesData.filter(
            (recipe) => !prevMeals.some((meal) => meal.recipe_id === recipe.recipe_id)
          );
          return [...prevMeals, ...newRecipes]; // add only unique recipes
        });
      } catch (error) {
        console.error("Error getting recipes:", error);
      }
    };

    getUsersRecipes();
  }, []); // only needs to be fetched once

  useEffect(() => {
    const updateCalendar = () => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();
      const firstDayOfMonth = new Date(year, month, 1);
      const lastDayOfMonth = new Date(year, month + 1, 0);
  
      const days: Day[] = [];
  
      for (let date = 1; date <= lastDayOfMonth.getDate(); date++) {
        const currentDate = new Date(year, month, date)
        const eventsForThisDate = meals.filter(
          (event) =>
            new Date(event.cook_date).toDateString() === currentDate.toDateString()
        );
  
        days.push({
          date: currentDate,
          events: eventsForThisDate,
        });
      }
    
      setDaysInMonth(days);
    };
  
    updateCalendar(); // update calendar whenever meals or currentMonth changes
  }, [currentMonth, meals]);
  

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleaddmeal = (day: Date, existingEvent?: RecipeData) => {
    const eventTitle = prompt(`Add meal title:`, existingEvent?.recipe_name || '');
  
    if (eventTitle) {
        addOrUpdateEvent(day, eventTitle, existingEvent?.recipe_id, existingEvent?.source_link);
    }
  };

  const handleviewmeal = (day: Date, existingEvent?: RecipeData) => {
    const eventTitle = prompt(`View meal title:`, existingEvent?.recipe_name || '');
  
    if (eventTitle) {
      if (existingEvent) {
        addOrUpdateEvent(day, eventTitle, existingEvent.recipe_id, existingEvent.source_link);
      }
    }
  };
  
  const addOrUpdateEvent = (day: Date, eventTitle: string, eventId?: number, source_link?: string) => {
    const newEvent: RecipeData = {
      recipe_id: eventId || Date.now(), 
      recipe_name: eventTitle,
      cook_date: day,
      source_link: source_link || '',
    };

    setDaysInMonth((prevDays) =>
      prevDays.map((d) =>
        d.date.toDateString() === day.toDateString()
          ? { ...d, events: eventId ?
              d.events.map(event => event.recipe_id === eventId ? newEvent : event)
              : [...d.events, newEvent] }
          : d
      )
    );
  };


  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  return (
    <div>
     <h2 className='month-top'>{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</h2>

    <div className="calendar-container">
      <header>
        <button id="prevnext" onClick={handlePrevMonth}>Previous</button>
        <button id="prevnext" onClick={handleNextMonth}>Next</button>
      </header>

      <div className="calendar-weekdays">
        {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day, index) => (
          <div key={index} className="calendar-weekday">
            {day}
          </div>
        ))}
      </div>

      <div className="calendar-grid">
        {/* Empty cells in  month */}
        {new Array(getFirstDayOfMonth(currentMonth)).fill(null).map((_, index) => (
          <div key={`empty-${index}`} className="calendar-day empty"></div>
        ))}

        {daysInMonth.map((day, index) => (
          <div key={index} className="calendar-day">
            <div>
              <span>{day.date.getDate()}</span>
            </div>
            <div className="meal-grid">
              {day.events.length === 0 ? (
                <></>
              ) : (
                <div className="meal-list">
                  {day.events.map((event) => (
                    <button 
                      id="meal-button"
                      key={event.recipe_id}
                      className="meal-item"
                      onClick={() => window.open(event.source_link, '_blank')}
                    >
                      {event.recipe_name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Calendar;