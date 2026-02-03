import { useState, useEffect } from 'react';
import { HABIT_CATEGORIES } from '../utils/constants';
import './HabitForm.css';

export default function HabitForm({ habit, onSave, onCancel }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('health');

  useEffect(() => {
    if (habit) {
      setName(habit.name);
      setCategory(habit.category || 'health');
    }
  }, [habit]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name: name.trim(), category });
  };

  return (
    <form onSubmit={handleSubmit} className="habit-form">
      <label>
        Habit Name
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Drink 8 glasses of water"
          required
        />
      </label>
      <label>
        Category
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {HABIT_CATEGORIES.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
      </label>
      <div className="habit-form-actions">
        <button type="submit" className="btn-primary">
          {habit ? 'Update' : 'Add'} Habit
        </button>
        {onCancel && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
