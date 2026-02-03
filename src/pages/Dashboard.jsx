import { useState } from 'react';
import { useHabits } from '../contexts/HabitContext';
import HabitCard from '../components/HabitCard';
import HabitForm from '../components/HabitForm';
import './Dashboard.css';

export default function Dashboard() {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleCompletion,
    isCompleted,
    getStreakForHabit,
    getCompletionRate,
  } = useHabits();
  const [showForm, setShowForm] = useState(false);

  const today = new Date().toDateString();
  const todayCount = habits.filter((h) => isCompleted(h.id, today)).length;
  const longestStreak = habits.reduce((max, h) => {
    const s = getStreakForHabit(h.id);
    return s > max ? s : max;
  }, 0);
  const avgCompletionRate =
    habits.length > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + getCompletionRate(h.id), 0) / habits.length
        )
      : 0;

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <button
          type="button"
          className="add-habit-btn"
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? '− Cancel' : '+ Add Habit'}
        </button>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <span className="summary-value">{todayCount}/{habits.length || '–'}</span>
          <span className="summary-label">Today&apos;s habits</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{longestStreak}</span>
          <span className="summary-label">Current streak</span>
        </div>
        <div className="summary-card">
          <span className="summary-value">{avgCompletionRate}%</span>
          <span className="summary-label">Completion rate</span>
        </div>
      </div>

      {showForm && (
        <div className="dashboard-form">
          <HabitForm
            onSave={(data) => {
              addHabit(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      <section className="dashboard-habits">
        <h2>My Habits</h2>
        {habits.length === 0 && !showForm ? (
          <div className="empty-state">
            <p>No habits yet. Add your first habit to get started!</p>
            <button type="button" className="add-habit-btn" onClick={() => setShowForm(true)}>
              + Add Habit
            </button>
          </div>
        ) : (
          <div className="habit-grid">
            {habits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                streak={getStreakForHabit(habit.id)}
                completionRate={getCompletionRate(habit.id)}
                isCompletedToday={isCompleted(habit.id, today)}
                onToggle={toggleCompletion}
                onUpdate={updateHabit}
                onDelete={deleteHabit}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
