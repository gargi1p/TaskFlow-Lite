// render.js (updated to show priority, due date, and random motivation quote)

const quotes = [
  "Productivity is never an accident.",
  "The secret of getting ahead is getting started.",
  "Focus on being productive instead of busy.",
  "Don’t watch the clock; do what it does. Keep going.",
  "Success is the sum of small efforts repeated daily."
];

export function renderTaskList(taskListElement, tasks, filter = 'all') {
  const quoteBanner = document.querySelector('.quote-banner');
  if (quoteBanner) {
    const random = quotes[Math.floor(Math.random() * quotes.length)];
    quoteBanner.textContent = `“${random}”`;
  }

  taskListElement.innerHTML = '';
  let filteredTasks = tasks;

  if (filter === 'active') filteredTasks = tasks.filter(t => !t.completed);
  else if (filter === 'completed') filteredTasks = tasks.filter(t => t.completed);

  const sortedTasks = [...filteredTasks].sort((a, b) => b.pinned - a.pinned);

  if (sortedTasks.length === 0) {
    taskListElement.innerHTML = `
      <li class="empty-state">
        <img src="images/empty-tasks.svg" alt="No tasks">
        <p>Add your first task!</p>
      </li>
    `;
    return;
  }

  sortedTasks.forEach(task => {
    const taskElement = document.createElement('li');
    taskElement.className = `task ${task.completed ? 'completed' : ''} priority-${task.priority} ${task.pinned ? 'pinned' : ''}`;
    taskElement.dataset.id = task.id;

    const dueBadge = task.dueDate ? `<div class="meta">Due: ${task.dueDate}</div>` : '';

    taskElement.innerHTML = `
      <label>
        <input type="checkbox" ${task.completed ? 'checked' : ''}>
        <span>${escapeHTML(task.text)}</span>
      </label>
      <div class="meta">Priority: ${task.priority}</div>
      ${dueBadge}
      <div class="task-actions">
        <button class="edit-btn" aria-label="Edit task">✏️</button>
        <button class="pin-btn" aria-label="Pin task">📌</button>
        <button class="delete-btn" aria-label="Delete task">🗑️</button>
      </div>
    `;
    taskListElement.appendChild(taskElement);
  });
}

function escapeHTML(str) {
  return str.replace(/[&<>"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[tag]));
}