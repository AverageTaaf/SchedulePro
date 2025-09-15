// DOM Elements
const modeToggle = document.getElementById("mode-toggle");
const sortSelect = document.getElementById("sort-select");
const addTaskBtn = document.getElementById("add-task");
const saveTaskBtn = document.getElementById("save-task");
const taskTitle = document.getElementById("task-title");
const taskDueDate = document.getElementById("task-due-date");
const taskDescription = document.getElementById("task-description");
const taskDifficulty = document.getElementById("task-difficulty");
const taskCheckpoints = document.getElementById("task-checkpoints");
const taskModalOverlay = document.getElementById("task-modal-overlay");
const helpModalOverlay = document.getElementById("help-modal-overlay");
const closeModal = document.getElementById("close-modal");
const closeHelpModal = document.getElementById("close-help-modal");
const deleteTaskBtn = document.getElementById("delete-task");
const saveChangesBtn = document.getElementById("save-changes");
const modalTitle = document.getElementById("modal-title");
const modalDueDate = document.getElementById("modal-due-date");
const modalDifficulty = document.getElementById("modal-difficulty");
const modalImportance = document.getElementById("modal-importance");
const modalDescription = document.getElementById("modal-description");
const modalProgressBar = document.getElementById("modal-progress-bar");
const modalProgressText = document.getElementById("modal-progress-text");
const modalCheckpoints = document.getElementById("modal-checkpoints");
const modalDifficultySelect = document.getElementById(
  "modal-difficulty-select"
);
const modalImportanceSelector = document.getElementById(
  "modal-importance-selector"
);
const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notification-message");
const notificationAction = document.getElementById("notification-action");
const notificationIcon = document.getElementById("notification-icon");
const importanceOptions = document.querySelectorAll(".importance-option");
const toggleFormBtn = document.getElementById("toggle-form");
const formContent = document.getElementById("form-content");
const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const inprogressTasksEl = document.getElementById("inprogress-tasks");
const overdueTasksEl = document.getElementById("overdue-tasks");
const showAllBtn = document.getElementById("show-all");
const showActiveBtn = document.getElementById("show-active");
const showCompletedBtn = document.getElementById("show-completed");
const clearCompletedBtn = document.getElementById("clear-completed");
const helpBtn = document.getElementById("help-btn");

const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");

// State
let tasks = JSON.parse(localStorage.getItem("schedulepro-tasks")) || [];
let currentEditingTaskId = null;
let currentImportance = 1;
let darkMode = localStorage.getItem("schedulepro-darkmode") === "true";
let formCollapsed = false;

// Initialize
function init() {
  // Set dark mode if enabled
  if (darkMode) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "☀️";
  }

  // Set today's date as default for due date
  const today = new Date().toISOString().split("T")[0];
  taskDueDate.value = today;
  taskDueDate.min = today;

  // Load tasks
  renderTasks();

  // Check for overdue tasks
  checkOverdueTasks();

  // Update stats
  updateStats();

  // Set up event listeners
  setupEventListeners();

  // Initialize form as expanded
  formContent.style.maxHeight = formContent.scrollHeight + "px";
}

// Toggle form visibility with animation
function toggleForm() {
  if (formContent.style.maxHeight) {
    // Form is expanded, so collapse it
    formContent.style.maxHeight = null;
    formContent.style.opacity = "0";
    formContent.style.pointerEvents = "none";
    toggleFormBtn.innerHTML = '<i class="fas fa-plus"></i>Expand';
  } else {
    // Form is collapsed, so expand it
    formContent.style.maxHeight = formContent.scrollHeight + "px";
    formContent.style.opacity = "1";
    formContent.style.pointerEvents = "all";
    toggleFormBtn.innerHTML = '<i class="fas fa-minus"></i>Collapse';
  }
}

// Set up event listeners
function setupEventListeners() {
  modeToggle.addEventListener("click", toggleDarkMode);
  sortSelect.addEventListener("change", () => renderTasks());
  addTaskBtn.addEventListener("click", addTask);
  saveTaskBtn.addEventListener("click", saveTask);
  closeModal.addEventListener("click", closeTaskModal);
  closeHelpModal.addEventListener("click", closeHelpModalWindow);
  deleteTaskBtn.addEventListener("click", deleteTask);
  saveChangesBtn.addEventListener("click", updateTask);
  notificationAction.addEventListener("click", () =>
    notification.classList.remove("show")
  );
  toggleFormBtn.addEventListener("click", toggleForm);
  helpBtn.addEventListener("click", openHelpModal);

  // Importance selection
  importanceOptions.forEach((option) => {
    option.addEventListener("click", () => {
      importanceOptions.forEach((o) => o.classList.remove("selected"));
      option.classList.add("selected");
      currentImportance = parseInt(option.dataset.importance);
    });
  });

  // Quick actions
  showAllBtn.addEventListener("click", () => filterTasks("all"));
  showActiveBtn.addEventListener("click", () => filterTasks("active"));
  showCompletedBtn.addEventListener("click", () => filterTasks("completed"));
  clearCompletedBtn.addEventListener("click", clearCompletedTasks);

  // Drag and drop for tasks
  setupDragAndDrop();

  // Check for overdue tasks on page load
  window.addEventListener("load", checkOverdueTasks);
}

// Open help modal
function openHelpModal() {
  helpModalOverlay.classList.add("active");
}

// Close help modal
function closeHelpModalWindow() {
  helpModalOverlay.classList.remove("active");
}

// Setup drag and drop
function setupDragAndDrop() {
  const taskLists = document.querySelectorAll(".task-list");

  taskLists.forEach((list) => {
    list.addEventListener("dragover", (e) => {
      e.preventDefault();
      const draggingTask = document.querySelector(".dragging");
      if (draggingTask) {
        const afterElement = getDragAfterElement(list, e.clientY);
        if (afterElement) {
          list.insertBefore(draggingTask, afterElement);
        } else {
          list.appendChild(draggingTask);
        }
      }
    });

    list.addEventListener("drop", (e) => {
      e.preventDefault();
      const taskId = document.querySelector(".dragging").dataset.id;
      const newStatus = list.parentElement.dataset.status;

      // Update task status
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        saveTasks();
        renderTasks();
        updateStats();
      }
    });
  });
}

// Get drag after element
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task-widget:not(.dragging)"),
  ];

  return draggableElements.reduce(
    (closest, child) => {
      const box = child.getBoundingClientRect();
      const offset = y - box.top - box.height / 2;

      if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
      } else {
        return closest;
      }
    },
    { offset: Number.NEGATIVE_INFINITY }
  ).element;
}

// Filter tasks
function filterTasks(filter) {
  const taskWidgets = document.querySelectorAll(".task-widget");

  taskWidgets.forEach((widget) => {
    const taskId = widget.dataset.id;
    const task = tasks.find((t) => t.id === taskId);

    if (filter === "all") {
      widget.style.display = "flex";
    } else if (filter === "active") {
      widget.style.display = task.status !== "done" ? "flex" : "none";
    } else if (filter === "completed") {
      widget.style.display = task.status === "done" ? "flex" : "none";
    }
  });
}

// Clear completed tasks
function clearCompletedTasks() {
  if (
    confirm(
      "Are you sure you want to clear all completed tasks? This action cannot be undone."
    )
  ) {
    tasks = tasks.filter((t) => t.status !== "done");
    saveTasks();
    renderTasks();
    updateStats();

    showNotification("Completed tasks cleared successfully!", "success");
  }
}

// Update stats
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;
  const overdue = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    return dueDate < today && t.status !== "done";
  }).length;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  inprogressTasksEl.textContent = inProgress;
  overdueTasksEl.textContent = overdue;
}

// Toggle dark mode
function toggleDarkMode() {
  darkMode = !darkMode;

  if (darkMode) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    modeToggle.textContent = "🌙";
  }

  localStorage.setItem("schedulepro-darkmode", darkMode);
}

// Add new task
function addTask() {
  if (!taskTitle.value.trim()) {
    showNotification("Task title is required!", "error");
    return;
  }

  const checkpoints = taskCheckpoints.value
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => ({ text: line.trim(), completed: false }));

  const newTask = {
    id: Date.now().toString(),
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    dueDate: taskDueDate.value,
    difficulty: taskDifficulty.value,
    importance: currentImportance,
    checkpoints: checkpoints,
    progress: 0,
    status: "todo",
    dateAdded: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  resetForm();
  updateStats();

  showNotification("Task added successfully!", "success");
}

// Save task (update existing)
function saveTask() {
  if (!currentEditingTaskId) return;

  const taskIndex = tasks.findIndex((t) => t.id === currentEditingTaskId);
  if (taskIndex === -1) return;

  tasks[taskIndex].title = taskTitle.value.trim();
  tasks[taskIndex].description = taskDescription.value.trim();
  tasks[taskIndex].dueDate = taskDueDate.value;
  tasks[taskIndex].difficulty = taskDifficulty.value;
  tasks[taskIndex].importance = currentImportance;

  // Update checkpoints
  const checkpoints = taskCheckpoints.value
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => ({ text: line.trim(), completed: false }));
  tasks[taskIndex].checkpoints = checkpoints;

  saveTasks();
  renderTasks();
  resetForm();
  updateStats();

  showNotification("Task updated successfully!", "success");
}

// Update task from modal
function updateTask() {
  if (!currentEditingTaskId) return;

  const taskIndex = tasks.findIndex((t) => t.id === currentEditingTaskId);
  if (taskIndex === -1) return;

  // Update checkpoints
  const checkpointInputs = modalCheckpoints.querySelectorAll(
    'input[type="checkbox"]'
  );
  const checkpointLabels = modalCheckpoints.querySelectorAll("label");

  tasks[taskIndex].checkpoints = Array.from(checkpointInputs).map(
    (input, index) => ({
      text: checkpointLabels[index].textContent,
      completed: input.checked,
    })
  );

  // Update progress
  const completed = tasks[taskIndex].checkpoints.filter(
    (c) => c.completed
  ).length;
  const total = tasks[taskIndex].checkpoints.length;
  tasks[taskIndex].progress =
    total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update difficulty
  tasks[taskIndex].difficulty = modalDifficultySelect.value;

  // Update importance
  const selectedImportance = modalImportanceSelector.querySelector(".selected");
  if (selectedImportance) {
    tasks[taskIndex].importance = parseInt(
      selectedImportance.dataset.importance
    );
  }

  // Auto-update task status based on progress
  if (tasks[taskIndex].progress === 100) {
    tasks[taskIndex].status = "done";
  } else if (tasks[taskIndex].progress > 0) {
    tasks[taskIndex].status = "in-progress";
  } else {
    tasks[taskIndex].status = "todo";
  }

  saveTasks();
  renderTasks();
  closeTaskModal();
  updateStats();

  showNotification("Task updated successfully!", "success");
}

// Delete task
function deleteTask() {
  if (!currentEditingTaskId) return;

  if (
    confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    )
  ) {
    tasks = tasks.filter((t) => t.id !== currentEditingTaskId);
    saveTasks();
    renderTasks();
    closeTaskModal();
    updateStats();

    showNotification("Task deleted successfully!", "success");
  }
}

// Open task modal
function openTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  currentEditingTaskId = taskId;

  // Populate modal
  modalTitle.textContent = task.title;
  modalDueDate.textContent = `Due: ${formatDate(task.dueDate)}`;
  modalDifficulty.textContent =
    task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1);
  modalDifficulty.className = "difficulty difficulty-" + task.difficulty;
  modalImportance.textContent = `Level ${task.importance}`;
  modalImportance.className = `importance-label importance-${task.importance}-label`;
  modalDescription.textContent = task.description;
  modalProgressBar.style.width = `${task.progress}%`;
  modalProgressText.textContent = `${task.progress}%`;

  // Set difficulty select
  modalDifficultySelect.value = task.difficulty;

  // Set importance
  const importanceOptions =
    modalImportanceSelector.querySelectorAll(".importance-option");
  importanceOptions.forEach((option) => {
    option.classList.remove("selected");
    if (parseInt(option.dataset.importance) === task.importance) {
      option.classList.add("selected");
    }
  });

  // Populate checkpoints
  modalCheckpoints.innerHTML = "";
  task.checkpoints.forEach((checkpoint) => {
    const checkpointDiv = document.createElement("div");
    checkpointDiv.className = "checkpoint";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.id = `checkpoint-${Date.now()}-${Math.random()}`;
    input.checked = checkpoint.completed;
    input.addEventListener("change", () => {
      // Update task status when checkpoints are changed
      const completed =
        modalCheckpoints.querySelectorAll("input:checked").length;
      const total = modalCheckpoints.querySelectorAll("input").length;

      if (completed === total && total > 0) {
        // All checkpoints completed - move to done
        tasks.find((t) => t.id === taskId).status = "done";
      } else if (completed > 0) {
        // Some checkpoints completed - move to in-progress
        tasks.find((t) => t.id === taskId).status = "in-progress";
      } else {
        // No checkpoints completed - move to todo
        tasks.find((t) => t.id === taskId).status = "todo";
      }

      saveTasks();
      renderTasks();
      updateStats();
    });

    const label = document.createElement("label");
    label.htmlFor = input.id;
    label.textContent = checkpoint.text;

    checkpointDiv.appendChild(input);
    checkpointDiv.appendChild(label);
    modalCheckpoints.appendChild(checkpointDiv);
  });

  // Show modal
  taskModalOverlay.classList.add("active");
}

// Close task modal
function closeTaskModal() {
  taskModalOverlay.classList.remove("active");
  currentEditingTaskId = null;
}

// Reset form
function resetForm() {
  taskTitle.value = "";
  taskDescription.value = "";

  // Set today's date as default for due date
  const today = new Date().toISOString().split("T")[0];
  taskDueDate.value = today;

  taskDifficulty.value = "easy";
  taskCheckpoints.value = "";

  // Reset importance to default
  importanceOptions.forEach((option) => {
    option.classList.remove("selected");
    if (parseInt(option.dataset.importance) === 1) {
      option.classList.add("selected");
    }
  });
  currentImportance = 1;

  saveTaskBtn.disabled = true;
  currentEditingTaskId = null;
}

// Edit task (populate form)
function editTask(taskId, e) {
  if (e) e.stopPropagation();

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  currentEditingTaskId = taskId;

  taskTitle.value = task.title;
  taskDescription.value = task.description;
  taskDueDate.value = task.dueDate;
  taskDifficulty.value = task.difficulty;
  taskCheckpoints.value = task.checkpoints.map((c) => c.text).join("\n");

  // Set importance
  importanceOptions.forEach((option) => {
    option.classList.remove("selected");
    if (parseInt(option.dataset.importance) === task.importance) {
      option.classList.add("selected");
    }
  });
  currentImportance = task.importance;

  saveTaskBtn.disabled = false;

  // Scroll to form
  document.querySelector(".task-form").scrollIntoView({ behavior: "smooth" });

  // Expand form if collapsed
  if (!formContent.style.maxHeight) {
    toggleForm();
  }
}

// Render tasks
function renderTasks() {
  // Clear lists
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  // Sort tasks
  const sortedTasks = sortTasks(tasks);

  // Check if we have any tasks at all
  if (sortedTasks.length === 0) {
    todoList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <p>No tasks to do. Add a new task!</p>
                    </div>
                `;
    inProgressList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-spinner"></i>
                        <p>No tasks in progress</p>
                    </div>
                `;
    doneList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-check-circle"></i>
                        <p>No tasks completed yet</p>
                    </div>
                `;
    return;
  }

  // Count tasks for each category
  const todoTasks = sortedTasks.filter((t) => t.status === "todo");
  const inProgressTasks = sortedTasks.filter((t) => t.status === "in-progress");
  const doneTasks = sortedTasks.filter((t) => t.status === "done");

  // Render empty states if no tasks in a category
  if (todoTasks.length === 0) {
    todoList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-clipboard-list"></i>
                        <p>No tasks to do. Add a new task!</p>
                    </div>
                `;
  }

  if (inProgressTasks.length === 0) {
    inProgressList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-spinner"></i>
                        <p>No tasks in progress</p>
                    </div>
                `;
  }

  if (doneTasks.length === 0) {
    doneList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-check-circle"></i>
                        <p>No tasks completed yet</p>
                    </div>
                `;
  }

  // Render tasks
  sortedTasks.forEach((task) => {
    const taskElement = createTaskElement(task);

    if (task.status === "todo") {
      todoList.appendChild(taskElement);
    } else if (task.status === "in-progress") {
      inProgressList.appendChild(taskElement);
    } else if (task.status === "done") {
      doneList.appendChild(taskElement);
    }
  });

  // Add drag and drop to tasks
  const taskWidgets = document.querySelectorAll(".task-widget");
  taskWidgets.forEach((widget) => {
    widget.setAttribute("draggable", true);

    widget.addEventListener("dragstart", () => {
      widget.classList.add("dragging");
    });

    widget.addEventListener("dragend", () => {
      widget.classList.remove("dragging");
    });
  });

  // Add drop zones to categories
  const categories = document.querySelectorAll(".category");
  categories.forEach((category) => {
    category.addEventListener("dragover", (e) => {
      e.preventDefault();
      category.classList.add("drop-over");
    });

    category.addEventListener("dragleave", () => {
      category.classList.remove("drop-over");
    });

    category.addEventListener("drop", (e) => {
      e.preventDefault();
      category.classList.remove("drop-over");
    });
  });
}

// Create task element
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-widget";
  taskElement.dataset.id = task.id;

  // Check if task is overdue or due soon
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const isOverdue = dueDate < today && task.status !== "done";
  const isDueSoon =
    !isOverdue &&
    dueDate < new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) &&
    task.status !== "done";

  // Create importance indicator
  let importanceDots = "";
  for (let i = 0; i < 3; i++) {
    importanceDots += `<div class="importance-dot"></div>`;
  }

  taskElement.innerHTML = `
                <h3>${task.title} <span class="importance-label importance-${
    task.importance
  }-label">Level ${task.importance}</span></h3>
                <p>${task.description.substring(0, 80)}${
    task.description.length > 80 ? "..." : ""
  }</p>
                <div class="task-meta">
                    <span class="${
                      isOverdue ? "overdue" : isDueSoon ? "due-soon" : ""
                    }">${formatDate(task.dueDate)}</span>
                    <span class="difficulty difficulty-${task.difficulty}">${
    task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)
  }</span>
                </div>
                <div class="importance importance-${task.importance}">
                    ${importanceDots}
                </div>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${
                      task.progress
                    }%"></div>
                </div>
                <div class="progress-text">
                    <span>Progress</span>
                    <span>${task.progress}%</span>
                </div>
                <div class="task-actions">
                    <button class="btn-warning edit-task"><i class="fas fa-edit"></i>Edit</button>
                </div>
            `;

  if (isOverdue) {
    taskElement.classList.add("overdue");
  } else if (isDueSoon) {
    taskElement.classList.add("due-soon");
  }

  // Add event listeners
  taskElement.addEventListener("click", () => openTaskModal(task.id));
  taskElement
    .querySelector(".edit-task")
    .addEventListener("click", (e) => editTask(task.id, e));

  return taskElement;
}

// Sort tasks
function sortTasks(tasks) {
  const sortValue = sortSelect.value;

  return [...tasks].sort((a, b) => {
    switch (sortValue) {
      case "date-added-asc":
        return new Date(a.dateAdded) - new Date(b.dateAdded);
      case "date-added-desc":
        return new Date(b.dateAdded) - new Date(a.dateAdded);
      case "importance-asc":
        return a.importance - b.importance;
      case "importance-desc":
        return b.importance - a.importance;
      case "progress-asc":
        return a.progress - b.progress;
      case "progress-desc":
        return b.progress - a.progress;
      case "due-date-asc":
        return new Date(a.dueDate) - new Date(b.dueDate);
      case "due-date-desc":
        return new Date(b.dueDate) - new Date(a.dueDate);
      default:
        return 0;
    }
  });
}

// Save tasks to localStorage
function saveTasks() {
  localStorage.setItem("schedulepro-tasks", JSON.stringify(tasks));
}

// Check for overdue tasks
function checkOverdueTasks() {
  const today = new Date();
  const overdueTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return dueDate < today && task.status !== "done";
  });

  if (overdueTasks.length > 0) {
    showNotification(
      `You have ${overdueTasks.length} overdue task(s)!`,
      "warning"
    );
  }
}

function toggleForm() {
  formCollapsed = !formCollapsed;
  if (formCollapsed) {
    formContent.classList.add("collapsed");
    toggleFormBtn.innerHTML = '<i class="fas fa-plus"></i>Expand';
  } else {
    formContent.classList.remove("collapsed");
    toggleFormBtn.innerHTML = '<i class="fas fa-minus"></i>Collapse';
  }
}

// Show notification
function showNotification(message, type) {
  notificationMessage.textContent = message;

  // Set notification color based on type
  if (type === "error") {
    notification.style.backgroundColor = "var(--danger)";
    notificationIcon.className = "fas fa-exclamation-circle";
  } else if (type === "success") {
    notification.style.backgroundColor = "var(--success)";
    notificationIcon.className = "fas fa-check-circle";
  } else if (type === "warning") {
    notification.style.backgroundColor = "var(--warning)";
    notification.style.color = "var(--dark)";
    notificationIcon.className = "fas fa-exclamation-triangle";
  } else {
    notification.style.backgroundColor = "var(--primary)";
    notificationIcon.className = "fas fa-bell";
  }

  notification.classList.add("show");

  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 5000);
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
}

// Initialize the app
init();
