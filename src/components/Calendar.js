import React, { useState } from "react";
import "../styles/Calendar.css";

const exampleEvents = {
  "2023-06-01": ["surgery"],
  "2023-06-02": ["polyclinic"],
  "2023-06-03": ["evaluation"],
  "2023-06-08": ["surgery", "evaluation"],
  "2023-06-15": ["polyclinic"],
  "2023-06-22": ["surgery"],
  "2023-06-29": ["evaluation"],
  "2023-06-30": ["polyclinic"],
};

function generateCalendar(year, month) {
  // Create a Date for the first day of the ongoing month
  const firstOfMonth = new Date(year, month, 1);
  let firstDay = firstOfMonth.getDay();
  if (firstDay === 0) firstDay = 7; // treat Sunday as 7
  const offset = firstDay - 1; // number of blank cells at start
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const calendar = [];

  for (let i = 0; i < 42; i++) {
    const dayNum = i - offset + 1;
    if (dayNum < 1) {
      // Cells for previous month: render as blank
      calendar.push({ blank: true });
    } else {
      let date, isCurrentMonth;
      if (dayNum <= daysInMonth) {
        // Ongoing (current) month
        date = new Date(year, month, dayNum);
        isCurrentMonth = true;
      } else {
        // Upcoming month: calculate date in next month
        const nextMonth = month + 1;
        date = new Date(year, nextMonth, dayNum - daysInMonth);
        isCurrentMonth = false;
      }
      calendar.push({
        date,
        dayNum: date.getDate(),
        isCurrentMonth,
      });
    }
  }
  return calendar;
}

function formatDateKey(date) {
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const Calendar = () => {
  // Initialize with today's date by default
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [showPicker, setShowPicker] = useState(false);
  const [tempMonth, setTempMonth] = useState(currentMonth);
  const [tempYear, setTempYear] = useState(currentYear);

  const calendarDays = generateCalendar(currentYear, currentMonth);
  const monthName = monthNames[currentMonth];

  const handlePrevMonth = () => {
    let newMonth = currentMonth - 1;
    let newYear = currentYear;
    if (newMonth < 0) {
      newMonth = 11;
      newYear = currentYear - 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const handleNextMonth = () => {
    let newMonth = currentMonth + 1;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear = currentYear + 1;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const togglePicker = () => {
    setTempMonth(currentMonth);
    setTempYear(currentYear);
    setShowPicker(!showPicker);
  };

  const applyPicker = () => {
    setCurrentMonth(tempMonth);
    setCurrentYear(tempYear);
    setShowPicker(false);
  };

  // Group cells into rows (6 rows, 7 columns)
  const rows = [];
  for (let i = 0; i < 6; i++) {
    rows.push(calendarDays.slice(i * 7, i * 7 + 7));
  }

  const yearRange = [];
  for (let y = currentYear - 5; y <= currentYear + 5; y++) {
    yearRange.push(y);
  }

  return (
    <div className="calendar-container">
      {/* Header Section */}
      <div className="calendar-header">
        <div className="arrow-container">
          <span className="arrow" onClick={handlePrevMonth}>
            &#8249;
          </span>
        </div>
        <div className="month-year-wrapper">
          <h3 className="month-year-text" onClick={togglePicker}>
            {monthName} {currentYear}
          </h3>
          {showPicker && (
            <div className="month-year-overlay">
              <div className="overlay-content">
                <label>Month:</label>
                <select
                  value={tempMonth}
                  onChange={(e) => setTempMonth(Number(e.target.value))}
                >
                  {monthNames.map((m, i) => (
                    <option value={i} key={m}>
                      {m}
                    </option>
                  ))}
                </select>
                <label>Year:</label>
                <select
                  value={tempYear}
                  onChange={(e) => setTempYear(Number(e.target.value))}
                >
                  {yearRange.map((yr) => (
                    <option value={yr} key={yr}>
                      {yr}
                    </option>
                  ))}
                </select>
                <div className="overlay-actions">
                  <button onClick={applyPicker}>Apply</button>
                  <button onClick={togglePicker}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="arrow-container">
          <span className="arrow" onClick={handleNextMonth}>
            &#8250;
          </span>
        </div>
      </div>

      {/* Legend */}
      <div className="calendar-legend">
        <span className="dot surgery"></span> Surgery
        <span className="dot polyclinic"></span> Polyclinic
        <span className="dot evaluation"></span> Evaluation
      </div>

      {/* Calendar Table */}
      <table className="calendar-table">
        <thead>
          <tr>
            <th>MON</th>
            <th>TUE</th>
            <th>WED</th>
            <th>THU</th>
            <th>FRI</th>
            <th>SAT</th>
            <th>SUN</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((week, wIndex) => (
            <tr key={wIndex}>
              {week.map((dayObj, dIndex) => {
                // If cell is marked as blank (previous month), render empty cell.
                if (dayObj.blank) {
                  return <td key={dIndex}></td>;
                }
                const { date, dayNum, isCurrentMonth } = dayObj;
                const dateKey = formatDateKey(date);
                const events = exampleEvents[dateKey] || [];
                const isToday =
                  date.toDateString() === new Date().toDateString();

                return (
                  <td
                    key={dIndex}
                    className={!isCurrentMonth ? "prev-next-month" : ""}
                  >
                    {isToday ? (
                      <span className="today-circle">{dayNum}</span>
                    ) : (
                      dayNum
                    )}
                    <div className="dots">
                      {events.includes("surgery") && (
                        <span className="dot surgery"></span>
                      )}
                      {events.includes("polyclinic") && (
                        <span className="dot polyclinic"></span>
                      )}
                      {events.includes("evaluation") && (
                        <span className="dot evaluation"></span>
                      )}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Calendar;
