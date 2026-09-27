const taskInput = document.getElementById("taskInput");
const dateInput = document.getElementById("dateInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let theme = localStorage.getItem("theme") || "light";

document.body.className = theme;

function save() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("theme", document.body.className);
}

function toggleTheme() {
    document.body.className =
        document.body.className === "dark" ? "light" : "dark";
    save();
}

function addTask() {
    if (!taskInput.value || !dateInput.value)
        return alert("Enter task & date");

    tasks.push({
        text: taskInput.value,
        date: dateInput.value,
        completed: false
    });

    taskInput.value = "";
    dateInput.value = "";
    save();
    render();
}

function render() {
    taskList.innerHTML = "";
    const today = new Date().toISOString().split("T")[0];

    tasks.forEach((task, i) => {
        const li = document.createElement("li");
        if (task.date < today && !task.completed) li.classList.add("overdue");

        li.innerHTML = `
          <span class="${task.completed ? "completed" : ""}"
                onclick="toggle(${i})">
            ${task.text} (📅 ${task.date})
          </span>
          <button onclick="del(${i})">❌</button>
        `;
        taskList.appendChild(li);
    });
}

function toggle(i) {
    tasks[i].completed = !tasks[i].completed;
    save();
    render();
}

function del(i) {
    tasks.splice(i, 1);
    save();
    render();
}

render();
