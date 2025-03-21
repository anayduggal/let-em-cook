/*import React from "react";
import "../components/Calendar.css"; // Import the CSS file

interface CalendarProps {
  style?: React.CSSProperties;
}

const Calendar: React.FC<CalendarProps> = ({ style }) => {
  const weekdays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  const dates = Array.from({ length: 30 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  return (
    <div className="calendar-container" style={style}>
      <h1 className="calendar-title">NOVEMBER 2024</h1>
      <div className="calendar-weekdays">
        {weekdays.map((day, index) => (
          <div key={index} className="weekday">
            {day}
          </div>
        ))}
      </div>
      <div className="calendar-dates">
        {Array(4)
          .fill(null)
          .map((_, index) => (
            <div key={`empty-${index}`} className="empty-date" />
          ))}
        {dates.map((date, index) => (
          <div key={index} className="calendar-date">
            {date}
          </div>
        ))}
      </div>
    </div>
  );
};

Calendar.defaultProps = {
  style: {
    width: "100%",
    maxWidth: "987px",
    height: "auto",
  },
};

export default Calendar;
*/