import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import { HABIT_CATEGORIES } from '../utils/constants';
import './Calendar.css';

export default function Calendar() {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const { habits, toggleCompletion, isCompleted } = useHabits();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array(firstDay).fill(null);

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1));
    setSelectedDate(null);
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1));
    setSelectedDate(null);
  };

  const getCompletionLevelForDay = (day) => {
    const date = new Date(year, month, day);
    const dateStr = date.toDateString();
    if (habits.length === 0) return 0;
    const completed = habits.filter((h) => isCompleted(h.id, dateStr)).length;
    return Math.round((completed / habits.length) * 100);
  };

  /* GitHub-style heatmap: 0 = empty, 1-4 = intensity levels */
  const getHeatmapLevel = (rate) => {
    if (rate === 0) return 0;
    if (rate < 25) return 1;
    if (rate < 50) return 2;
    if (rate < 75) return 3;
    return 4;
  };

  const selectedDateStr = selectedDate
    ? new Date(year, month, selectedDate).toDateString()
    : null;
  const todayStr = new Date().toDateString();
  const canMarkForSelectedDate = selectedDateStr === todayStr;

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  return (
    <div className="calendar-page">
      <div className="calendar-header">
        <button type="button" className="nav-btn" onClick={prevMonth} aria-label="Previous month">
          ←
        </button>
        <h2>{monthNames[month]} {year}</h2>
        <button type="button" className="nav-btn" onClick={nextMonth} aria-label="Next month">
          →
        </button>
      </div>

      <div className="calendar-heatmap-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="heatmap-weekday">{d}</div>
        ))}
        {padding.map((_, i) => (
          <div key={`pad-${i}`} className="heatmap-cell heatmap-cell--empty" />
        ))}
        {days.map((day) => {
          const rate = getCompletionLevelForDay(day);
          const level = getHeatmapLevel(rate);
          const isSelected = selectedDate === day;
          const isToday =
            year === new Date().getFullYear() &&
            month === new Date().getMonth() &&
            day === new Date().getDate();

          return (
            <button
              key={day}
              type="button"
              className={`heatmap-cell heatmap-cell--level-${level} ${isSelected ? 'heatmap-cell--selected' : ''} ${isToday ? 'heatmap-cell--today' : ''}`}
              onClick={() => setSelectedDate(isSelected ? null : day)}
              title={`${rate}% complete`}
            >
              <span className="heatmap-cell-num">{day}</span>
            </button>
          );
        })}
      </div>

      <div className="calendar-legend">
        <span>Less</span>
        <span className="legend-cell heatmap-cell--level-0" />
        <span className="legend-cell heatmap-cell--level-1" />
        <span className="legend-cell heatmap-cell--level-2" />
        <span className="legend-cell heatmap-cell--level-3" />
        <span className="legend-cell heatmap-cell--level-4" />
        <span>More</span>
      </div>

      {selectedDateStr && (
        <div className="calendar-detail">
          <h3>{new Date(selectedDateStr).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}</h3>
          {!canMarkForSelectedDate && (
            <p className="calendar-view-only">
              View only. You can only mark habits as done for today.
            </p>
          )}
          <div className="calendar-habits-list">
            {habits.length === 0 ? (
              <p className="no-habits">No habits yet. Add habits from the Dashboard.</p>
            ) : (
              habits.map((habit) => {
                const cat = HABIT_CATEGORIES.find(c => c.id === habit.category) || HABIT_CATEGORIES[0];
                const completed = isCompleted(habit.id, selectedDateStr);
                return (
                  <label
                    key={habit.id}
                    className={`calendar-habit-item ${completed ? 'completed' : ''} ${!canMarkForSelectedDate ? 'calendar-habit-item--disabled' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={completed}
                      disabled={!canMarkForSelectedDate}
                      onChange={() => toggleCompletion(habit.id, selectedDateStr, canMarkForSelectedDate)}
                    />
                    <span
                      className="calendar-habit-dot"
                      style={{ backgroundColor: cat.color }}
                    />
                    <span className="calendar-habit-name">{habit.name}</span>
                  </label>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
