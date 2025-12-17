document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskButton = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');

    const STORAGE_KEY = 'todo.tasks.v1';

    const saveTasks = (tasks) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    };

    const loadTasks = () => {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.error('Failed to load tasks from storage', e);
            return [];
        }
    };

    const renderTask = (task) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (task.completed) li.classList.add('task-completed');

        const span = document.createElement('div');
        span.className = 'task-text';
        span.textContent = task.text;
        span.tabIndex = 0; // make focusable for keyboard toggling

        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const removeBtn = document.createElement('button');
        removeBtn.className = 'btn-remove';
        removeBtn.type = 'button';
        removeBtn.textContent = 'Remove';

        // Events
        const toggleCompleted = () => {
            task.completed = !task.completed;
            li.classList.toggle('task-completed', task.completed);
            const all = loadTasks().map((t) => (t.id === task.id ? task : t));
            saveTasks(all);
        };

        span.addEventListener('click', toggleCompleted);
        span.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') toggleCompleted();
        });

        removeBtn.addEventListener('click', () => {
            const tasks = loadTasks().filter((t) => t.id !== task.id);
            saveTasks(tasks);
            li.remove();
        });

        actions.appendChild(removeBtn);
        li.appendChild(span);
        li.appendChild(actions);
        taskList.appendChild(li);
    };

    const addTask = (text) => {
        const tasks = loadTasks();
        const newTask = { id: Date.now().toString(), text, completed: false };
        tasks.push(newTask);
        saveTasks(tasks);
        renderTask(newTask);
    };

    // initial render
    (function init() {
        const tasks = loadTasks();
        tasks.forEach(renderTask);
    })();

    // attach handlers
    if (addTaskButton && taskInput) {
        addTaskButton.addEventListener('click', () => {
            const text = taskInput.value.trim();
            if (!text) return;
            addTask(text);
            taskInput.value = '';
            taskInput.focus();
        });

        taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTaskButton.click();
        });
    }
});