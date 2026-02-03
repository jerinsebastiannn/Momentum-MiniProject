export function getStreak(completions, habitId) {
  const habitCompletions = (completions[habitId] || [])
    .map(d => new Date(d).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));

  if (habitCompletions.length === 0) return 0;

  const today = new Date().toDateString();
  let streak = 0;
  let checkDate = new Date();

  for (let i = 0; i < 365; i++) {
    const dateStr = checkDate.toDateString();
    if (habitCompletions.includes(dateStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      if (i === 0 && dateStr !== today) {
        checkDate.setDate(checkDate.getDate() - 1);
        continue;
      }
      break;
    }
  }

  return streak;
}

export function formatDate(date) {
  return new Date(date).toDateString();
}
