const nameField = document.getElementById("taskName");
const dateField = document.getElementById("taskDate");
const priorityField = document.getElementById("taskPriority");
const addButton = document.getElementById("addBtn");
const taskContainer = document.getElementById("taskContainer");
const filterBox = document.getElementById("filterTasks");
const themeButton = document.getElementById("themeBtn");

const totalDisplay = document.getElementById("totalTasks");
const completedDisplay = document.getElementById("finishedTasks");
const progressDisplay = document.getElementById("progressValue");
const emptyMessage = document.getElementById("emptyMessage");

let taskData = JSON.parse(localStorage.getItem("plannerTasks")) || [];
let currentTheme = localStorage.getItem("plannerTheme") || "light";

document.body.classList.toggle("dark-mode", currentTheme === "dark");
themeButton.textContent = currentTheme === "dark" ? "☀️" : "🌙";

addButton.addEventListener("click", createTask);
themeButton.addEventListener("click", switchTheme);
filterBox.addEventListener("change", displayTasks);

function createTask() {
    const title = nameField.value.trim();
    const deadline = dateField.value;

    if (title === "" || deadline === "") {
        alert("Please enter a task and select a date.");
        return;
    }

    const newTask = {
        id: Date.now(),
        title: title,
        deadline: deadline,
        priority: priorityField.value,
        completed: false
    };

    taskData.push(newTask);

    saveTasks();

    nameField.value = "";
    dateField.value = "";
    priorityField.value = "Medium";

    displayTasks();
}

function displayTasks() {
    taskContainer.innerHTML = "";

    const selectedFilter = filterBox.value;

    let visibleTasks = taskData;

    if (selectedFilter === "pending") {
        visibleTasks = taskData.filter(task => !task.completed);
    }

    if (selectedFilter === "completed") {
        visibleTasks = taskData.filter(task => task.completed);
    }

    if (visibleTasks.length === 0) {
        emptyMessage.style.display = "block";
    } else {
        emptyMessage.style.display = "none";
    }

    visibleTasks.forEach(task => {
        const item = document.createElement("li");

        if (task.completed) {
            item.classList.add("done");
        }

        const today = new Date().toISOString().split("T")[0];

        if (task.deadline < today && !task.completed) {
            item.classList.add("late");
        }

        item.innerHTML = `
            <div class="task-info">
                <h3>${escapeText(task.title)}</h3>
                <p>📅 ${task.deadline}</p>
                <span class="priority ${task.priority.toLowerCase()}">
                    ${task.priority}
                </span>
            </div>

            <div class="task-actions">
                <button onclick="completeTask(${task.id})">
                    ${task.completed ? "↩️" : "✓"}
                </button>

                <button onclick="editTask(${task.id})">
                    ✏️
                </button>

                <button onclick="removeTask(${task.id})">
                    🗑️
                </button>
            </div>
        `;

        taskContainer.appendChild(item);
    });

    updateSummary();
}

function completeTask(taskId) {
    const selectedTask = taskData.find(task => task.id === taskId);

    if (selectedTask) {
        selectedTask.completed = !selectedTask.completed;
        saveTasks();
        displayTasks();
    }
}

function editTask(taskId) {
    const selectedTask = taskData.find(task => task.id === taskId);

    if (!selectedTask) {
        return;
    }

    const updatedTitle = prompt("Edit task name:", selectedTask.title);

    if (updatedTitle === null || updatedTitle.trim() === "") {
        return;
    }

    selectedTask.title = updatedTitle.trim();

    saveTasks();
    displayTasks();
}

function removeTask(taskId) {
    taskData = taskData.filter(task => task.id !== taskId);

    saveTasks();
    displayTasks();
}

function updateSummary() {
    const total = taskData.length;
    const completed = taskData.filter(task => task.completed).length;

    const percentage = total === 0
        ? 0
        : Math.round((completed / total) * 100);

    totalDisplay.textContent = total;
    completedDisplay.textContent = completed;
    progressDisplay.textContent = percentage + "%";
}

function switchTheme() {
    document.body.classList.toggle("dark-mode");

    const darkEnabled = document.body.classList.contains("dark-mode");

    currentTheme = darkEnabled ? "dark" : "light";

    themeButton.textContent = darkEnabled ? "☀️" : "🌙";

    localStorage.setItem("plannerTheme", currentTheme);
}

function saveTasks() {
    localStorage.setItem("plannerTasks", JSON.stringify(taskData));
}

function escapeText(value) {
    const element = document.createElement("div");
    element.textContent = value;
    return element.innerHTML;
}

displayTasks();
