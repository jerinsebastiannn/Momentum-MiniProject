import { useState } from 'react';
import { HABIT_CATEGORIES } from '../utils/constants';
import HabitForm from './HabitForm';
import './HabitCard.css';

export default function HabitCard({ habit, streak, completionRate, isCompletedToday, onToggle, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const cat = HABIT_CATEGORIES.find(c => c.id === habit.category) || HABIT_CATEGORIES[0];

  const handleSave = (data) => {
    onUpdate(habit.id, data);
    setEditing(false);
  };

  if (editing) {
    return (
      <div className="habit-card habit-card--editing">
        <HabitForm habit={habit} onSave={handleSave} onCancel={() => setEditing(false)} />
      </div>
    );
  }

  return (
    <div
      className={`habit-card ${isCompletedToday ? 'habit-card--completed' : ''}`}
      style={{ '--category-color': cat.color }}
    >
      {isCompletedToday && (
        <div className="habit-card-checkmark" aria-hidden="true">
          ✓
        </div>
      )}
      <div className="habit-card-header">
        <span className="habit-category-badge">{cat.name}</span>
        <div className="habit-card-actions">
          <button type="button" className="icon-btn" onClick={() => setEditing(true)} aria-label="Edit">
            ✏️
          </button>
          <button type="button" className="icon-btn" onClick={() => onDelete(habit.id)} aria-label="Delete">
            🗑️
          </button>
        </div>
      </div>
      <h3 className="habit-name">{habit.name}</h3>
      <div className="habit-stats">
        <span className="habit-streak">🔥 {streak} day streak</span>
        <span className="habit-rate">{completionRate}% this week</span>
      </div>
      <div className="habit-progress-bar">
        <div
          className="habit-progress-fill"
          style={{ width: `${completionRate}%` }}
        />
      </div>
      <label className="habit-checkbox">
        <input
          type="checkbox"
          checked={isCompletedToday}
          onChange={() => onToggle(habit.id, new Date().toISOString())}
        />
        <span className="checkmark">Mark done today</span>
      </label>
    </div>
  );
}
