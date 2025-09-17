// Add these variables at the top of your script.js
const authBtn = document.getElementById("auth-btn");
const authModalOverlay = document.getElementById("auth-modal-overlay");
const closeAuthModal = document.getElementById("close-auth-modal");
const authTabs = document.querySelectorAll(".auth-tab");
const loginContent = document.getElementById("login-content");
const signupContent = document.getElementById("signup-content");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirm = document.getElementById("signup-confirm");
const signupBtn = document.getElementById("signup-btn");
const userModalOverlay = document.getElementById("user-modal-overlay");
const closeUserModal = document.getElementById("close-user-modal");
const userDisplayName = document.getElementById("user-display-name");
const userEmail = document.getElementById("user-email");
const changePasswordBtn = document.getElementById("change-password-btn");
const logoutBtn = document.getElementById("logout-btn");

// Password requirement elements
const reqLength = document.getElementById("req-length");
const reqUpper = document.getElementById("req-upper");
const reqLower = document.getElementById("req-lower");
const reqNumber = document.getElementById("req-number");
const reqSpecial = document.getElementById("req-special");

// State variables
let currentUser = null;
let users = JSON.parse(localStorage.getItem("schedulepro-users")) || {};
let reminderCheckInterval = null;

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

// Initialize authentication
function initAuth() {
  // Check if user is logged in
  const savedUser = localStorage.getItem("schedulepro-current-user");
  if (savedUser) {
    currentUser = JSON.parse(savedUser);
    updateAuthUI();
    loadUserTasks();
  }

  // Set up event listeners for auth
  setupAuthEventListeners();

  // Start checking for reminders
  startReminderChecks();
}

// Set up authentication event listeners
function setupAuthEventListeners() {
  authBtn.addEventListener("click", toggleAuthModal);
  closeAuthModal.addEventListener("click", closeAuthModalWindow);

  // Auth tabs
  authTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabName = tab.dataset.tab;
      authTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");

      if (tabName === "login") {
        loginContent.classList.remove("hidden");
        signupContent.classList.add("hidden");
      } else {
        loginContent.classList.add("hidden");
        signupContent.classList.remove("hidden");
      }
    });
  });

  // Login form
  loginBtn.addEventListener("click", handleLogin);

  // Signup form
  signupBtn.addEventListener("click", handleSignup);
  signupPassword.addEventListener("input", validatePassword);

  // User modal
  closeUserModal.addEventListener("click", closeUserModalWindow);
  changePasswordBtn.addEventListener("click", showChangePasswordModal);
  logoutBtn.addEventListener("click", handleLogout);
}

// Toggle auth modal
function toggleAuthModal() {
  if (currentUser) {
    // Show user modal if logged in
    userDisplayName.textContent = currentUser.username;
    userEmail.textContent = currentUser.email;
    userModalOverlay.classList.add("active");
  } else {
    // Show auth modal if not logged in
    authModalOverlay.classList.add("active");
  }
}

// Close auth modal
function closeAuthModalWindow() {
  authModalOverlay.classList.remove("active");
  resetAuthForms();
}

// Close user modal
function closeUserModalWindow() {
  userModalOverlay.classList.remove("active");
}

// Reset auth forms
function resetAuthForms() {
  loginEmail.value = "";
  loginPassword.value = "";
  signupUsername.value = "";
  signupEmail.value = "";
  signupPassword.value = "";
  signupConfirm.value = "";

  // Reset password requirements
  const requirements = [reqLength, reqUpper, reqLower, reqNumber, reqSpecial];
  requirements.forEach((req) => {
    req.classList.remove("valid");
  });
}

// Validate password
function validatePassword() {
  const password = signupPassword.value;

  // Check requirements
  reqLength.classList.toggle("valid", password.length >= 8);
  reqUpper.classList.toggle("valid", /[A-Z]/.test(password));
  reqLower.classList.toggle("valid", /[a-z]/.test(password));
  reqNumber.classList.toggle("valid", /[0-9]/.test(password));
  reqSpecial.classList.toggle("valid", /[^A-Za-z0-9]/.test(password));
}

// Handle login
function handleLogin() {
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    showNotification("Please enter both email and password", "error");
    return;
  }

  // Find user by email
  const user = Object.values(users).find((u) => u.email === email);

  if (!user || user.password !== password) {
    showNotification("Invalid email or password", "error");
    return;
  }

  // Login successful
  currentUser = {
    id: user.id,
    username: user.username,
    email: user.email,
  };

  localStorage.setItem("schedulepro-current-user", JSON.stringify(currentUser));
  updateAuthUI();
  loadUserTasks();
  closeAuthModalWindow();

  showNotification(`Welcome back, ${user.username}!`, "success");
}

// Handle signup
function handleSignup() {
  const username = signupUsername.value.trim();
  const email = signupEmail.value.trim();
  const password = signupPassword.value;
  const confirmPassword = signupConfirm.value;

  // Validate inputs
  if (!username || !email || !password || !confirmPassword) {
    showNotification("Please fill in all fields", "error");
    return;
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error");
    return;
  }

  // Check password strength
  if (!isPasswordStrong(password)) {
    showNotification("Password does not meet requirements", "error");
    return;
  }

  // Check if username already exists
  if (users[username]) {
    showNotification("Username already exists", "error");
    return;
  }

  // Check if email already exists
  if (Object.values(users).some((user) => user.email === email)) {
    showNotification("Email already registered", "error");
    return;
  }

  // Create new user
  const userId = generateId();
  users[username] = {
    id: userId,
    username,
    email,
    password, // In a real app, this would be hashed
    tasks: [],
  };

  // Save users to localStorage
  localStorage.setItem("schedulepro-users", JSON.stringify(users));

  // Auto login
  currentUser = {
    id: userId,
    username,
    email,
  };

  localStorage.setItem("schedulepro-current-user", JSON.stringify(currentUser));
  updateAuthUI();
  closeAuthModalWindow();

  showNotification(
    `Account created successfully! Welcome, ${username}!`,
    "success"
  );
}

// Check password strength
function isPasswordStrong(password) {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

// Update auth UI
function updateAuthUI() {
  if (currentUser) {
    authBtn.innerHTML = '<i class="fas fa-user"></i>' + currentUser.username;
    // Add notification badge if user has overdue tasks
    updateNotificationBadge();
  } else {
    authBtn.innerHTML = '<i class="fas fa-user"></i>Login';
  }
}

// Update notification badge
function updateNotificationBadge() {
  // Remove existing badge
  const existingBadge = authBtn.querySelector(".notification-badge");
  if (existingBadge) {
    existingBadge.remove();
  }

  if (currentUser && currentUser.tasks) {
    const overdueCount = currentUser.tasks.filter((task) => {
      const dueDate = new Date(task.dueDate);
      const today = new Date();
      return dueDate < today && task.status !== "done";
    }).length;

    if (overdueCount > 0) {
      const badge = document.createElement("div");
      badge.className = "notification-badge";
      badge.textContent = overdueCount;
      authBtn.style.position = "relative";
      authBtn.appendChild(badge);
    }
  }
}

// Load user tasks
function loadUserTasks() {
  if (currentUser) {
    const userData = users[currentUser.username];
    if (userData && userData.tasks) {
      tasks = userData.tasks;
    } else {
      tasks = [];
    }
    renderTasks();
    updateStats();
  }
}

// Save tasks to user account
function saveTasks() {
  if (currentUser) {
    if (!users[currentUser.username]) {
      users[currentUser.username] = {
        id: currentUser.id,
        username: currentUser.username,
        email: currentUser.email,
        password: users[currentUser.username]?.password || "",
        tasks: [],
      };
    }

    users[currentUser.username].tasks = tasks;
    localStorage.setItem("schedulepro-users", JSON.stringify(users));
  } else {
    // Fallback to local storage if no user is logged in
    localStorage.setItem("schedulepro-tasks", JSON.stringify(tasks));
  }
}

// Handle logout
function handleLogout() {
  currentUser = null;
  localStorage.removeItem("schedulepro-current-user");
  tasks = [];
  updateAuthUI();
  renderTasks();
  updateStats();
  closeUserModalWindow();

  showNotification("You have been logged out", "info");
}

// Show change password modal
function showChangePasswordModal() {
  // Implementation for change password modal
  showNotification(
    "Change password functionality would be implemented here",
    "info"
  );
}

// Generate unique ID
function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Generate unique 10-digit task code
function generateTaskCode() {
  return (
    Math.random().toString(36).substr(2, 5).toUpperCase() +
    Math.random().toString(36).substr(2, 5).toUpperCase()
  );
}

// Start checking for reminders
function startReminderChecks() {
  // Clear existing interval
  if (reminderCheckInterval) {
    clearInterval(reminderCheckInterval);
  }

  // Check every hour
  reminderCheckInterval = setInterval(checkReminders, 60 * 60 * 1000);

  // Also check immediately on load
  checkReminders();
}

// Check for upcoming task reminders
function checkReminders() {
  if (!currentUser) return;

  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  tasks.forEach((task) => {
    if (task.status !== "done") {
      const dueDate = new Date(task.dueDate);

      // Check if due date is within the next 2 days
      if (dueDate <= twoDaysFromNow && dueDate > now) {
        // Check if we've already notified about this task
        if (!task.reminderSent) {
          showNotification(
            `Reminder: Task "${task.title}" is due in 2 days! Task Code: ${task.taskCode}`,
            "warning"
          );

          // Mark reminder as sent
          task.reminderSent = true;
          saveTasks();
        }
      }
    }
  });
}

// Modify the addTask function to include task code
function addTask() {
  if (!currentUser) {
    showNotification("Please log in to add tasks", "error");
    return;
  }

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
    taskCode: generateTaskCode(), // Add unique task code
    title: taskTitle.value.trim(),
    description: taskDescription.value.trim(),
    dueDate: taskDueDate.value,
    difficulty: taskDifficulty.value,
    importance: currentImportance,
    checkpoints: checkpoints,
    progress: 0,
    status: "todo",
    dateAdded: new Date().toISOString(),
    reminderSent: false, // Track if reminder has been sent
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks();
  resetForm();
  updateStats();

  showNotification("Task added successfully!", "success");
}

// Modify the task element to display task code
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
                <div class="task-code">Task Code: ${task.taskCode}</div>
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

// Update the init function to include auth initialization
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

  // Initialize authentication
  initAuth();

  // Load tasks (if user is logged in, this will be handled by initAuth)
  if (!currentUser) {
    tasks = JSON.parse(localStorage.getItem("schedulepro-tasks")) || [];
    renderTasks();
    updateStats();
  }

  // Check for overdue tasks
  checkOverdueTasks();

  // Set up event listeners
  setupEventListeners();

  // Initialize form as expanded
  formContent.style.maxHeight = formContent.scrollHeight + "px";
}

// Update the setupEventListeners function to include auth events
function setupEventListeners() {
  // Existing event listeners...
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

// Show notification for successful load
showNotification("SchedulePro loaded successfully!", "success");
// Notification for unsaved changes if user tries to leave
window.addEventListener("beforeunload", (e) => {
  if (currentEditingTaskId) {
    e.preventDefault();
    e.returnValue = "";
  }
});

// Update task
function updateTask() {
  if (!currentEditingTaskId) return;
  const taskIndex = tasks.findIndex((t) => t.id === currentEditingTaskId);
  if (taskIndex === -1) return;

  // Validate title
  if (!modalTitle.textContent.trim()) {
    showNotification("Task title is required!", "error");
    return;
  }
  tasks[taskIndex].title = modalTitle.textContent.trim();

  // Update description
  tasks[taskIndex].description = modalDescription.value.trim();
  // Update due date
  tasks[taskIndex].dueDate = modalDueDate.value;
  // Update checkpoints
  const updatedCheckpoints = [];
  modalCheckpoints.querySelectorAll(".checkpoint").forEach((cp) => {
    const input = cp.querySelector("input");
    const label = cp.querySelector("label");
    updatedCheckpoints.push({
      text: label.textContent,
      completed: input.checked,
    });
  });
  tasks[taskIndex].checkpoints = updatedCheckpoints;
  // Update difficulty
  tasks[taskIndex].difficulty = modalDifficultySelect.value;
  // Update importance
  tasks[taskIndex].importance = currentImportance;
  // Update progress
  const completedCount = updatedCheckpoints.filter((cp) => cp.completed).length;
  const totalCount = updatedCheckpoints.length;
  tasks[taskIndex].progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);
  // Update status based on progress
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
  currentEditingTaskId = null;
  showNotification("Task updated successfully!", "success");
}

// Initialize the app
init();
