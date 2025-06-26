// app.js (Final Update: Priority, Due Date, Pin, Reminders, Multilingual)
import { loadTasks, saveTasks } from './storage.js';
import { renderTaskList } from './render.js';
import { validateTaskInput } from './validation.js';

let tasks = loadTasks();
let currentFilter = 'all';
const taskListElement = document.getElementById('task-list');
const statsElement = document.getElementById('task-stats');
renderTaskList(taskListElement, tasks, currentFilter);
updateStats();

function createTask(text, priority, dueDate) {
  return {
    id: Date.now(),
    text: text.trim(),
    priority,
    dueDate,
    pinned: false,
    completed: false,
    createdAt: new Date().toLocaleString()
  };
}

document.getElementById('task-form').addEventListener('submit', e => {
  e.preventDefault();
  const input = document.getElementById('task-input');
  const priority = document.getElementById('priority-select').value;
  const dueDate = document.getElementById('due-date').value;

  if (validateTaskInput(input.value)) {
    tasks.push(createTask(input.value, priority, dueDate));
    saveTasks(tasks);
    renderTaskList(taskListElement, tasks, currentFilter);
    updateStats();
    input.value = '';
    document.getElementById('due-date').value = '';
  }
});

taskListElement.addEventListener('click', e => {
  const taskElement = e.target.closest('.task');
  if (!taskElement) return;
  const taskId = Number(taskElement.dataset.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (e.target.classList.contains('delete-btn')) {
    tasks.splice(taskIndex, 1);
    saveTasks(tasks);
    renderTaskList(taskListElement, tasks, currentFilter);
    updateStats();
  }
  if (e.target.type === 'checkbox') {
    tasks[taskIndex].completed = e.target.checked;
    saveTasks(tasks);
    renderTaskList(taskListElement, tasks, currentFilter);
    updateStats();
  }
  if (e.target.classList.contains('edit-btn')) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-content">
        <h3>Edit Task</h3>
        <input type="text" id="edit-task-input" value="${tasks[taskIndex].text}" />
        <select id="edit-priority">
          <option value="low" ${tasks[taskIndex].priority === 'low' ? 'selected' : ''}>Low</option>
          <option value="medium" ${tasks[taskIndex].priority === 'medium' ? 'selected' : ''}>Medium</option>
          <option value="high" ${tasks[taskIndex].priority === 'high' ? 'selected' : ''}>High</option>
        </select>
        <input type="date" id="edit-date" value="${tasks[taskIndex].dueDate}" />
        <div class="modal-actions">
          <button id="save-edit">Save</button>
          <button id="cancel-edit">Cancel</button>
        </div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById('save-edit').addEventListener('click', () => {
      const newText = document.getElementById('edit-task-input').value;
      const newPriority = document.getElementById('edit-priority').value;
      const newDate = document.getElementById('edit-date').value;
      if (validateTaskInput(newText)) {
        tasks[taskIndex].text = newText.trim();
        tasks[taskIndex].priority = newPriority;
        tasks[taskIndex].dueDate = newDate;
        saveTasks(tasks);
        renderTaskList(taskListElement, tasks, currentFilter);
        updateStats();
        document.body.removeChild(modal);
      }
    });

    document.getElementById('cancel-edit').addEventListener('click', () => {
      document.body.removeChild(modal);
    });
  }
  if (e.target.classList.contains('pin-btn')) {
    tasks[taskIndex].pinned = !tasks[taskIndex].pinned;
    saveTasks(tasks);
    renderTaskList(taskListElement, tasks, currentFilter);
  }
});

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    renderTaskList(taskListElement, tasks, currentFilter);
    updateStats();
  });
});

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const active = total - completed;
  statsElement.textContent = `Total: ${total} | Active: ${active} | Completed: ${completed}`;
}

document.getElementById('toggle-theme').addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  document.getElementById('toggle-theme').textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
});

document.getElementById('language-select').addEventListener('change', e => {
  const lang = e.target.value;
  const labels = {
    en: {
      app_title: 'TaskFlow Lite',
      quote: '“Productivity is never an accident.”',
      task_placeholder: 'Add a new task',
      add_task: 'Add Task',
      filter_all: 'All',
      filter_active: 'Active',
      filter_completed: 'Completed',
      priority_low: 'Low',
      priority_medium: 'Medium',
      priority_high: 'High'
    },
    hi: {
      app_title: 'टास्कफ्लो लाइट',
      quote: '“उत्पादकता कभी दुर्घटना नहीं होती।”',
      task_placeholder: 'एक नया कार्य जोड़ें',
      add_task: 'कार्य जोड़ें',
      filter_all: 'सभी',
      filter_active: 'सक्रिय',
      filter_completed: 'पूर्ण',
      priority_low: 'कम',
      priority_medium: 'मध्यम',
      priority_high: 'उच्च'
    }
  };

  const elements = document.querySelectorAll('[data-i18n]');
  elements.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (el.tagName === 'INPUT' && el.hasAttribute('placeholder')) {
      el.setAttribute('placeholder', labels[lang][key]);
    } else {
      el.textContent = labels[lang][key];
    }
  });
});
