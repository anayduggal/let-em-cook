import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import './Calendar.css';

interface Event {
  id: number;
  title: string;
  date: Date;
}

interface Day {
  date: Date;
  events: Event[];
}

const Calendar: React.FC = () => {
  const navigate = useNavigate();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [daysInMonth, setDaysInMonth] = useState<Day[]>([]);
  const meals: Event[] = [
    { id: 1, date: "2025-03-05T10:00:00", title: "Sandwich"},
    //  mock events
  ];

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
            new Date(event.date).toDateString() === currentDate.toDateString()
        );
  
        days.push({
          date: currentDate,
          events: eventsForThisDate,
        });
      }
  
      setDaysInMonth(days);
    };
  
    updateCalendar();
  }, [currentMonth, meals]);
  

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)));
  };

  const handleaddmeal = (day: Date, existingEvent?: Event) => {
    const eventTitle = prompt(`Add meal title:`, existingEvent?.title || '');
  
    if (eventTitle) {
        addOrUpdateEvent(day, eventTitle);
    }
  };

  const handleviewmeal = (day: Date, existingEvent?: Event) => {
    const eventTitle = prompt(`View meal title:`, existingEvent?.title || '');
  
    if (eventTitle) {
      if (existingEvent) {
        addOrUpdateEvent(day, eventTitle, existingEvent.id);
      }
    }
  };
  
  const addOrUpdateEvent = (day: Date, eventTitle: string, eventId?: number) => {
    const newEvent: Event = {
      id: eventId || Date.now(), 
      title: eventTitle,
      date: day
    };

    setDaysInMonth((prevDays) =>
      prevDays.map((d) =>
        d.date.toDateString() === day.toDateString()
          ? { ...d, events: eventId ?
              d.events.map(event => event.id === eventId ? newEvent : event)
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
              {/* Add meal button for each day */}
              {day.events.length === 0 ? (
                <button
                  id="meal-button"
                  onClick={() => handleaddmeal(day.date)}
                >
                  Add Meal
                </button>
              ) : (
                <div className="meal-list">
                  {day.events.map((event) => (
                    <button 
                      id="meal-button"
                      key={event.id}
                      className="meal-item"
                      onClick={() => handleviewmeal(day.date, event)}
                    >
                      {event.title}
                    </button>
                  ))}

                  <button
                    id="meal-button"
                    onClick={() => handleaddmeal(day.date)}
                  >
                    Add Meal
                  </button>

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