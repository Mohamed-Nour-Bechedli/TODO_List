const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let isEditing = false;
let editingIndex = null;
let currentFilter = 'all';

// Load tasks from localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
renderTasks();


addTaskBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') addTask();
});

function addTask() {
    const text = taskInput.value.trim();
    const date = document.getElementById('dateInput').value;
    const time = document.getElementById('timeInput').value;

    if (!text) return;

    if (isEditing) {
        // Update existing task
        tasks[editingIndex].text = text;
        tasks[editingIndex].date = date;
        tasks[editingIndex].time = time;

        isEditing = false;
        editingIndex = null;
        addTaskBtn.textContent = 'Add';
    } else {
        // Add new task
        tasks.push({ text, date, time, completed: false });
    }

    // Clear inputs
    taskInput.value = '';
    document.getElementById('dateInput').value = '';
    document.getElementById('timeInput').value = '';

    saveTasks();
    renderTasks();
}


function renderTasks() {
    taskList.innerHTML = '';

    // Map filtered tasks with their original index
    const filteredTasks = tasks
        .map((task, index) => ({ task, index }))
        .filter(({ task }) => {
            if (currentFilter === 'active') return !task.completed;
            if (currentFilter === 'completed') return task.completed;
            return true;
        });

    filteredTasks.forEach(({ task, index }) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => toggleComplete(index));

        const taskInfo = document.createElement('div');
        taskInfo.innerHTML = `<strong>${task.text}</strong><br><small>${task.date || ''} ${task.time || ''}</small>`;
        taskInfo.style.flex = '1';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.style.marginRight = '5px';
        editBtn.addEventListener('click', () => editTask(index));

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(index));

        li.appendChild(checkbox);
        li.appendChild(taskInfo);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

function editTask(index) {
    const task = tasks[index];

    // Pre-fill the input fields
    taskInput.value = task.text;
    document.getElementById('dateInput').value = task.date;
    document.getElementById('timeInput').value = task.time;

    // Set editing state
    isEditing = true;
    editingIndex = index;

    // Change button text to "Update"
    addTaskBtn.textContent = 'Update';
}

function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    saveTasks();
    renderTasks();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveTasks();
    renderTasks();
}

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.getAttribute('data-filter');
        renderTasks();
    });
});

const themeToggle = document.getElementById('themeToggle');

// Load saved theme preference
if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.checked = true;
}

themeToggle.addEventListener('change', () => {
    if (themeToggle.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark');
    } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('theme', 'light');
    }
});