import { useHabits } from '../contexts/HabitContext';
import { HABIT_CATEGORIES } from '../utils/constants';
import './Statistics.css';

export default function Statistics() {
  const { habits, completions, getStreakForHabit, getCompletionRate } = useHabits();

  const totalCompletions = Object.values(completions).flat().length;
  const todayStr = new Date().toDateString();
  const todayCount = habits.filter((h) => {
    const list = completions[h.id] || [];
    return list.some((d) => new Date(d).toDateString() === todayStr);
  }).length;

  const avgWeeklyRate =
    habits.length > 0
      ? Math.round(
          habits.reduce((sum, h) => sum + getCompletionRate(h.id), 0) / habits.length
        )
      : 0;

  const longestStreak = habits.reduce((max, h) => {
    const s = getStreakForHabit(h.id);
    return s > max ? s : max;
  }, 0);

  const byCategory = HABIT_CATEGORIES.map((cat) => ({
    ...cat,
    count: habits.filter((h) => h.category === cat.id).length,
  }));

  const habitStats = habits.map((h) => ({
    ...h,
    streak: getStreakForHabit(h.id),
    rate: getCompletionRate(h.id),
    cat: HABIT_CATEGORIES.find((c) => c.id === h.category) || HABIT_CATEGORIES[0],
  }));

  return (
    <div className="statistics-page">
      <h2>Statistics</h2>

      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-value">{totalCompletions}</span>
          <span className="stat-label">Total Completions</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{todayCount}/{habits.length}</span>
          <span className="stat-label">Today</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{avgWeeklyRate}%</span>
          <span className="stat-label">Avg Weekly Rate</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{longestStreak}</span>
          <span className="stat-label">Longest Streak (days)</span>
        </div>
      </div>

      <section className="stats-section">
        <h3>Habits by Category</h3>
        <div className="category-bars">
          {byCategory.map((cat) => (
            <div key={cat.id} className="category-bar-row">
              <span className="category-name" style={{ color: cat.color }}>
                {cat.name}
              </span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${Math.min((cat.count / Math.max(habits.length, 1)) * 100, 100)}%`,
                    backgroundColor: cat.color,
                  }}
                />
              </div>
              <span className="category-count">{cat.count}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <h3>Weekly Completion by Habit</h3>
        <div className="habit-bars">
          {habitStats.map((h) => (
            <div key={h.id} className="habit-bar-row">
              <span
                className="habit-dot"
                style={{ backgroundColor: h.cat.color }}
              />
              <span className="habit-bar-name">{h.name}</span>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{
                    width: `${h.rate}%`,
                    backgroundColor: h.cat.color,
                  }}
                />
              </div>
              <span className="habit-bar-value">{h.rate}%</span>
            </div>
          ))}
        </div>
      </section>

      <section className="stats-section">
        <h3>Streaks</h3>
        <div className="streak-list">
          {habitStats.length === 0 ? (
            <p className="no-data">No habits to show streaks.</p>
          ) : (
            habitStats
              .sort((a, b) => b.streak - a.streak)
              .map((h) => (
                <div key={h.id} className="streak-item">
                  <span
                    className="streak-dot"
                    style={{ backgroundColor: h.cat.color }}
                  />
                  <span className="streak-name">{h.name}</span>
                  <span className="streak-value">🔥 {h.streak} days</span>
                </div>
              ))
          )}
        </div>
      </section>
    </div>
  );
}
