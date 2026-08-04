let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
let currentFilter = "all";
let editId = null;

const form = document.getElementById("taskForm");
const nameInput = document.getElementById("taskName");
const priorityInput = document.getElementById("priority");
const dateInput = document.getElementById("dueDate");
const formBtn = document.getElementById("formBtn");
const taskList = document.getElementById("taskList");
const filterBtns = document.querySelectorAll(".filter-btn");

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function updateCounts() {
  let total = tasks.length;
  let completed = tasks.filter((t) => t.completed).length;
  let pending = total - completed;

  document.getElementById("totalCount").textContent = total;
  document.getElementById("completedCount").textContent = completed;
  document.getElementById("pendingCount").textContent = pending;
}

function getVisibleTasks() {
  if (currentFilter === "completed") {
    return tasks.filter((t) => t.completed);
  }
  if (currentFilter === "pending") {
    return tasks.filter((t) => !t.completed);
  }
  return tasks;
}

function renderTasks() {
  const list = getVisibleTasks();
  taskList.innerHTML = "";

  if (list.length === 0) {
    taskList.innerHTML = '<li class="empty-msg">No tasks to show</li>';
    updateCounts();
    return;
  }

  list.forEach(function (task) {
    const li = document.createElement("li");
    li.className = "task-item" + (task.completed ? " done" : "");

    li.innerHTML = `
      <input type="checkbox" ${task.completed ? "checked" : ""} data-id="${task.id}" class="check-box">
      <div class="task-info">
        <span class="task-name">${task.name}</span>
        <span class="task-meta">
          <span class="priority-badge priority-${task.priority}">${task.priority}</span>
          Due: ${task.dueDate}
        </span>
      </div>
      <div class="task-actions">
        <button class="edit-btn" data-id="${task.id}">Edit</button>
        <button class="delete-btn" data-id="${task.id}">Delete</button>
      </div>
    `;

    taskList.appendChild(li);
  });

  updateCounts();
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  if (editId !== null) {
    // updating an existing task
    let task = tasks.find((t) => t.id === editId);
    task.name = nameInput.value;
    task.priority = priorityInput.value;
    task.dueDate = dateInput.value;
    editId = null;
    formBtn.textContent = "Add Task";
  } else {
    let newTask = {
      id: Date.now(),
      name: nameInput.value,
      priority: priorityInput.value,
      dueDate: dateInput.value,
      completed: false,
    };
    tasks.push(newTask);
  }

  saveTasks();
  renderTasks();
  form.reset();
});

taskList.addEventListener("click", function (e) {
  const id = Number(e.target.getAttribute("data-id"));

  if (e.target.classList.contains("delete-btn")) {
    tasks = tasks.filter((t) => t.id !== id);
    saveTasks();
    renderTasks();
  }

  if (e.target.classList.contains("edit-btn")) {
    let task = tasks.find((t) => t.id === id);
    nameInput.value = task.name;
    priorityInput.value = task.priority;
    dateInput.value = task.dueDate;
    editId = id;
    formBtn.textContent = "Update Task";
    nameInput.focus();
  }

  if (e.target.classList.contains("check-box")) {
    let task = tasks.find((t) => t.id === id);
    task.completed = e.target.checked;
    saveTasks();
    renderTasks();
  }
});

filterBtns.forEach(function (btn) {
  btn.addEventListener("click", function () {
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    currentFilter = btn.getAttribute("data-filter");
    renderTasks();
  });
});

renderTasks();
