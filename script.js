// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA-KsOZhIGr7xCBExOBOmDUQmVL9neWJ2Y",
  authDomain: "taskschedule-pro.firebaseapp.com",
  databaseURL: "https://taskschedule-pro-default-rtdb.firebaseio.com",
  projectId: "taskschedule-pro",
  storageBucket: "taskschedule-pro.firebasestorage.app",
  messagingSenderId: "786531666672",
  appId: "1:786531666672:web:debae6aaa19dcf4f2b5035",
  measurementId: "G-MDS6Y5FMGT",
};

// Initialize Firebase
try {
  firebase.initializeApp(firebaseConfig);
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// DOM Elements
const modeToggle = document.getElementById("mode-toggle");
const sortSelect = document.getElementById("sort-select");
const searchInput = document.getElementById("search-input");
const helpBtn = document.getElementById("help-btn");
const authBtn = document.getElementById("auth-btn");
const settingsBtn = document.getElementById("settings-btn");
const toggleFormBtn = document.getElementById("toggle-form");
const addTaskBtn = document.getElementById("add-task");
const saveTaskBtn = document.getElementById("save-task");
const taskTitle = document.getElementById("task-title");
const taskDueDate = document.getElementById("task-due-date");
const taskRecurrence = document.getElementById("task-recurrence");
const taskDescription = document.getElementById("task-description");
const taskDifficulty = document.getElementById("task-difficulty");
const taskCheckpoints = document.getElementById("task-checkpoints");
const taskTags = document.getElementById("task-tags");
const formContent = document.getElementById("form-content");
const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");
const totalTasksEl = document.getElementById("total-tasks");
const completedTasksEl = document.getElementById("completed-tasks");
const inprogressTasksEl = document.getElementById("inprogress-tasks");
const overdueTasksEl = document.getElementById("overdue-tasks");
const tagsFilter = document.getElementById("tags-filter");
const archiveCompletedBtn = document.getElementById("archive-completed");
const showArchivedBtn = document.getElementById("show-archived");
const showAllBtn = document.getElementById("show-all");
const showActiveBtn = document.getElementById("show-active");
const showCompletedBtn = document.getElementById("show-completed");
const clearCompletedBtn = document.getElementById("clear-completed");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");
const taskModalOverlay = document.getElementById("task-modal-overlay");
const closeModal = document.getElementById("close-modal");
const modalTitle = document.getElementById("modal-title");
const modalTaskTitle = document.getElementById("modal-task-title");
const modalTaskDescription = document.getElementById("modal-task-description");
const modalTaskDueDate = document.getElementById("modal-task-due-date");
const modalTaskRecurrence = document.getElementById("modal-task-recurrence");
const modalTaskDifficulty = document.getElementById("modal-task-difficulty");
const modalTaskTags = document.getElementById("modal-task-tags");
const modalCheckpoints = document.getElementById("modal-checkpoints");
const deleteTaskBtn = document.getElementById("delete-task");
const saveChangesBtn = document.getElementById("save-changes");
const helpModalOverlay = document.getElementById("help-modal-overlay");
const closeHelpModal = document.getElementById("close-help-modal");
const authModalOverlay = document.getElementById("auth-modal-overlay");
const closeAuthModal = document.getElementById("close-auth-modal");
const authModalTitle = document.getElementById("auth-modal-title");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const switchToSignup = document.getElementById("switch-to-signup");
const switchToLogin = document.getElementById("switch-to-login");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById(
  "signup-confirm-password"
);
const registerBtn = document.getElementById("register-btn");
const googleLoginBtn = document.getElementById("google-login");
const googleRegisterBtn = document.getElementById("google-register");
const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notification-message");
const notificationAction = document.getElementById("notification-action");
const notificationIcon = document.getElementById("notification-icon");
const importanceOptions = document.querySelectorAll(".importance-option");
const settingsModalOverlay = document.getElementById("settings-modal-overlay");
const closeSettingsModal = document.getElementById("close-settings-modal");
const reduceMotion = document.getElementById("reduce-motion");
const disableAnimations = document.getElementById("disable-animations");
const defaultView = document.getElementById("default-view");
const defaultTheme = document.getElementById("default-theme");
const reminderTime = document.getElementById("reminder-time");
const saveSettingsBtn = document.getElementById("save-settings");

// State
let tasks = [];
let archivedTasks = [];
let currentEditingTaskId = null;
let currentImportance = 1;
let darkMode = localStorage.getItem("schedulepro-darkmode") === "true";
let formCollapsed = false;
let currentUser = null;
let authModalMode = "login";
let currentFilter = "all";
let currentSearch = "";
let currentTagFilter = "all";
let settings = {
  reduceMotion: false,
  disableAnimations: false,
  defaultView: "kanban",
  defaultTheme: "dark",
  reminderTime: "0",
};

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Initialize the application
function init() {
  // Load settings
  loadSettings();

  // Set dark mode if enabled
  if (darkMode) {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    modeToggle.textContent = "☀️";
  } else {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    modeToggle.textContent = "🌙";
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

  // Check authentication state
  auth.onAuthStateChanged((user) => {
    if (user) {
      currentUser = user;
      updateUIForLoggedInUser(user);
      loadUserTasks();
    } else {
      currentUser = null;
      updateUIForLoggedOutUser();
      // Load local tasks if any (for backward compatibility)
      tasks = JSON.parse(localStorage.getItem("schedulepro-tasks")) || [];
      renderTasks();
      updateStats();
    }
  });
}

// Load settings from localStorage
function loadSettings() {
  const savedSettings = localStorage.getItem("schedulepro-settings");
  if (savedSettings) {
    settings = JSON.parse(savedSettings);

    // Apply settings
    reduceMotion.checked = settings.reduceMotion;
    disableAnimations.checked = settings.disableAnimations;
    defaultView.value = settings.defaultView;
    defaultTheme.value = settings.defaultTheme;
    reminderTime.value = settings.reminderTime;

    // Apply animation settings
    if (settings.reduceMotion) {
      document.body.classList.add("reduce-motion");
    }

    if (settings.disableAnimations) {
      document.body.classList.add("no-animations");
    }
  }
}

// Save settings to localStorage
function saveSettings() {
  settings = {
    reduceMotion: reduceMotion.checked,
    disableAnimations: disableAnimations.checked,
    defaultView: defaultView.value,
    defaultTheme: defaultTheme.value,
    reminderTime: reminderTime.value,
  };

  localStorage.setItem("schedulepro-settings", JSON.stringify(settings));

  // Apply animation settings
  if (settings.reduceMotion) {
    document.body.classList.add("reduce-motion");
  } else {
    document.body.classList.remove("reduce-motion");
  }

  if (settings.disableAnimations) {
    document.body.classList.add("no-animations");
  } else {
    document.body.classList.remove("no-animations");
  }

  showNotification("Settings saved successfully!", "success");
  closeSettingsModalWindow();
}

// Set up all event listeners
function setupEventListeners() {
  // Theme toggle
  modeToggle.addEventListener("click", toggleDarkMode);

  // Search and filter
  searchInput.addEventListener("input", handleSearch);
  sortSelect.addEventListener("change", () => renderTasks());
  tagsFilter.addEventListener("change", (e) => {
    currentTagFilter = e.target.value;
    renderTasks();
  });

  // Form actions
  toggleFormBtn.addEventListener("click", toggleForm);
  addTaskBtn.addEventListener("click", addTask);
  saveTaskBtn.addEventListener("click", saveTask);

  // Importance selection
  importanceOptions.forEach((option) => {
    option.addEventListener("click", () => {
      importanceOptions.forEach((o) => o.classList.remove("selected"));
      option.classList.add("selected");
      currentImportance = parseInt(option.dataset.importance);
    });
  });

  // Quick actions
  archiveCompletedBtn.addEventListener("click", archiveCompletedTasks);
  showArchivedBtn.addEventListener("click", showArchivedTasks);
  showAllBtn.addEventListener("click", () => filterTasks("all"));
  showActiveBtn.addEventListener("click", () => filterTasks("active"));
  showCompletedBtn.addEventListener("click", () => filterTasks("completed"));
  clearCompletedBtn.addEventListener("click", clearCompletedTasks);
  exportBtn.addEventListener("click", exportTasks);
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importTasks);

  // Modal controls
  helpBtn.addEventListener("click", openHelpModal);
  closeHelpModal.addEventListener("click", closeHelpModalWindow);

  settingsBtn.addEventListener("click", openSettingsModal);
  closeSettingsModal.addEventListener("click", closeSettingsModalWindow);
  saveSettingsBtn.addEventListener("click", saveSettings);

  authBtn.addEventListener("click", openAuthModal);
  closeAuthModal.addEventListener("click", closeAuthModalWindow);

  closeModal.addEventListener("click", closeTaskModal);
  deleteTaskBtn.addEventListener("click", deleteTask);
  saveChangesBtn.addEventListener("click", updateTask);

  // Auth forms
  loginForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);
  switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthMode("signup");
  });
  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthMode("login");
  });

  // Google auth
  googleLoginBtn.addEventListener("click", signInWithGoogle);
  googleRegisterBtn.addEventListener("click", signInWithGoogle);

  // Notification
  notificationAction.addEventListener("click", () => {
    notification.classList.remove("show");
  });

  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target === taskModalOverlay) closeTaskModal();
    if (e.target === helpModalOverlay) closeHelpModalWindow();
    if (e.target === authModalOverlay) closeAuthModalWindow();
    if (e.target === settingsModalOverlay) closeSettingsModalWindow();
  });

  // Setup drag and drop
  setupDragAndDrop();
}

// Toggle dark/light mode
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

// Toggle form visibility
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

// Open settings modal
function openSettingsModal() {
  settingsModalOverlay.classList.add("active");
}

// Close settings modal
function closeSettingsModalWindow() {
  settingsModalOverlay.classList.remove("active");
}

// Handle search input
function handleSearch(e) {
  currentSearch = e.target.value.toLowerCase();
  renderTasks();
}

// Filter tasks
function filterTasks(filter) {
  currentFilter = filter;
  renderTasks();

  // Update active button state
  document.querySelectorAll(".quick-actions button").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
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

  // Generate unique task code
  const taskCode = generateTaskCode();

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
    taskCode: taskCode,
    recurrence: taskRecurrence.value,
    tags: Array.from(taskTags.selectedOptions).map((option) => option.value),
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
  tasks[taskIndex].recurrence = taskRecurrence.value;
  tasks[taskIndex].tags = Array.from(taskTags.selectedOptions).map(
    (option) => option.value
  );

  // Update checkpoints
  const checkpoints = taskCheckpoints.value
    .split("\n")
    .filter((line) => line.trim())
    .map((line) => ({ text: line.trim(), completed: false }));

  // Preserve completed status for existing checkpoints
  for (
    let i = 0;
    i < Math.min(checkpoints.length, tasks[taskIndex].checkpoints.length);
    i++
  ) {
    if (tasks[taskIndex].checkpoints[i].completed) {
      checkpoints[i].completed = true;
    }
  }

  tasks[taskIndex].checkpoints = checkpoints;

  // Recalculate progress
  const completed = checkpoints.filter((cp) => cp.completed).length;
  tasks[taskIndex].progress = checkpoints.length
    ? Math.round((completed / checkpoints.length) * 100)
    : 0;

  saveTasks();
  renderTasks();
  resetForm();
  updateStats();

  showNotification("Task updated successfully!", "success");
}

// Reset form
function resetForm() {
  taskTitle.value = "";
  taskDescription.value = "";
  taskDueDate.value = new Date().toISOString().split("T")[0];
  taskDifficulty.value = "easy";
  taskRecurrence.value = "none";
  taskCheckpoints.value = "";
  taskTags.selectedIndex = -1;

  // Reset importance
  importanceOptions.forEach((option) => {
    option.classList.remove("selected");
    if (option.dataset.importance === "1") {
      option.classList.add("selected");
    }
  });
  currentImportance = 1;

  // Reset save button
  saveTaskBtn.disabled = true;
  addTaskBtn.disabled = false;
  currentEditingTaskId = null;
}

// Render tasks based on filters
function renderTasks() {
  // Clear all lists
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  // Show empty states if no tasks
  if (tasks.length === 0) {
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

  // Filter tasks based on search and tag filter
  let filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(currentSearch) ||
      task.description.toLowerCase().includes(currentSearch);

    const matchesTag =
      currentTagFilter === "all" ||
      (task.tags && task.tags.includes(currentTagFilter));

    return matchesSearch && matchesTag;
  });

  // Apply status filter
  if (currentFilter === "active") {
    filteredTasks = filteredTasks.filter(
      (task) => task.status !== "done" && !task.archived
    );
  } else if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter(
      (task) => task.status === "done" && !task.archived
    );
  } else {
    filteredTasks = filteredTasks.filter((task) => !task.archived);
  }

  // Sort tasks
  sortTasks(filteredTasks);

  // Render tasks to their respective lists
  filteredTasks.forEach((task) => {
    const taskElement = createTaskElement(task);
    if (task.status === "todo") {
      todoList.appendChild(taskElement);
    } else if (task.status === "in-progress") {
      inProgressList.appendChild(taskElement);
    } else if (task.status === "done") {
      doneList.appendChild(taskElement);
    }
  });

  // Show empty states if no tasks in a category
  if (todoList.children.length === 0) {
    todoList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <p>No tasks to do</p>
      </div>
    `;
  }

  if (inProgressList.children.length === 0) {
    inProgressList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-spinner"></i>
        <p>No tasks in progress</p>
      </div>
    `;
  }

  if (doneList.children.length === 0) {
    doneList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-check-circle"></i>
        <p>No tasks completed</p>
      </div>
    `;
  }
}

// Create task element
function createTaskElement(task) {
  const taskEl = document.createElement("div");
  taskEl.className = "task";
  taskEl.draggable = true;
  taskEl.dataset.id = task.id;

  // Format due date
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  // Calculate days until due
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(task.dueDate);
  due.setHours(0, 0, 0, 0);
  const daysUntilDue = Math.floor((due - today) / (1000 * 60 * 60 * 24));

  // Determine if task is overdue
  const isOverdue = daysUntilDue < 0 && task.status !== "done";

  // Format tags
  const tagsHtml = task.tags
    ? task.tags
        .map(
          (tag) =>
            `<span class="task-tag" style="background-color: ${getTagColor(
              tag
            )}">${tag}</span>`
        )
        .join("")
    : "";

  // Format checkpoints progress
  const totalCheckpoints = task.checkpoints ? task.checkpoints.length : 0;
  const completedCheckpoints = task.checkpoints
    ? task.checkpoints.filter((cp) => cp.completed).length
    : 0;

  const checkpointsHtml =
    totalCheckpoints > 0
      ? `<div class="checkpoints-progress">
          <div class="progress-bar">
            <div class="progress" style="width: ${
              (completedCheckpoints / totalCheckpoints) * 100
            }%"></div>
          </div>
          <span>${completedCheckpoints}/${totalCheckpoints} checkpoints</span>
        </div>`
      : "";

  taskEl.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${task.title}</h3>
      <div class="task-importance importance-${task.importance}">
        ${"!".repeat(task.importance)}
      </div>
    </div>
    <div class="task-description">${task.description || "No description"}</div>
    ${checkpointsHtml}
    <div class="task-footer">
      <div class="task-meta">
        <div class="task-due-date ${isOverdue ? "overdue" : ""}">
          <i class="fas fa-calendar-day"></i>
          ${dueDate} ${
    isOverdue
      ? "(Overdue)"
      : daysUntilDue === 0
      ? "(Today)"
      : daysUntilDue === 1
      ? "(Tomorrow)"
      : `(${daysUntilDue} days)`
  }
        </div>
        <div class="task-difficulty difficulty-${task.difficulty}">
          ${task.difficulty}
        </div>
        ${tagsHtml ? `<div class="task-tags">${tagsHtml}</div>` : ""}
      </div>
      <div class="task-actions">
        <button class="btn-icon edit-task" title="Edit task">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon delete-task" title="Delete task">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>
  `;

  // Add event listeners for edit and delete
  taskEl.querySelector(".edit-task").addEventListener("click", () => {
    openEditTaskModal(task);
  });

  taskEl.querySelector(".delete-task").addEventListener("click", () => {
    deleteTaskById(task.id);
  });

  // Add drag event listeners
  taskEl.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", task.id);
    setTimeout(() => {
      taskEl.classList.add("dragging");
    }, 0);
  });

  taskEl.addEventListener("dragend", () => {
    taskEl.classList.remove("dragging");
  });

  return taskEl;
}

// Sort tasks based on selected criteria
function sortTasks(tasks) {
  const sortValue = sortSelect.value;

  switch (sortValue) {
    case "date-added-asc":
      tasks.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
      break;
    case "date-added-desc":
      tasks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    case "importance-asc":
      tasks.sort((a, b) => a.importance - b.importance);
      break;
    case "importance-desc":
      tasks.sort((a, b) => b.importance - a.importance);
      break;
    case "progress-asc":
      tasks.sort((a, b) => a.progress - b.progress);
      break;
    case "progress-desc":
      tasks.sort((a, b) => b.progress - a.progress);
      break;
    case "due-date-asc":
      tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      });
      break;
    case "due-date-desc":
      tasks.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(b.dueDate) - new Date(a.dueDate);
      });
      break;
    default:
      // Default sort by date added (newest first)
      tasks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
  }
}

// Setup drag and drop functionality
function setupDragAndDrop() {
  const lists = document.querySelectorAll(".task-list");
  const categories = document.querySelectorAll(".category");

  lists.forEach((list) => {
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
      const taskId = e.dataTransfer.getData("text/plain");
      const task = tasks.find((t) => t.id === taskId);
      if (task) {
        const category = list.closest(".category");
        const newStatus = category.dataset.status;

        // Update task status
        task.status = newStatus;

        // If moving to done, complete all checkpoints
        if (newStatus === "done") {
          if (task.checkpoints) {
            task.checkpoints.forEach((cp) => (cp.completed = true));
          }
          task.progress = 100;
        }

        // If moving from done to another status, reset checkpoints
        if (task.status !== "done" && newStatus !== "done") {
          if (task.checkpoints) {
            task.checkpoints.forEach((cp) => (cp.completed = false));
          }
          task.progress = 0;
        }

        saveTasks();
        updateStats();
        showNotification(`Task moved to ${newStatus.replace("-", " ")}!`);
      }
    });
  });

  categories.forEach((category) => {
    category.addEventListener("dragover", (e) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = "var(--hover-color)";
    });

    category.addEventListener("dragleave", (e) => {
      e.preventDefault();
      e.currentTarget.style.backgroundColor = "";
    });
  });
}

// Helper function for drag and drop
function getDragAfterElement(container, y) {
  const draggableElements = [
    ...container.querySelectorAll(".task:not(.dragging)"),
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

// Update statistics
function updateStats() {
  const totalTasks = tasks.filter((task) => !task.archived).length;
  const completedTasks = tasks.filter(
    (task) => task.status === "done" && !task.archived
  ).length;
  const inProgressTasks = tasks.filter(
    (task) => task.status === "in-progress" && !task.archived
  ).length;
  const overdueTasks = tasks.filter((task) => {
    if (task.status === "done" || task.archived || !task.dueDate) return false;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const due = new Date(task.dueDate);
    due.setHours(0, 0, 0, 0);
    return due < today;
  }).length;

  totalTasksEl.textContent = totalTasks;
  completedTasksEl.textContent = completedTasks;
  inprogressTasksEl.textContent = inProgressTasks;
  overdueTasksEl.textContent = overdueTasks;
}

// Check for overdue tasks
function checkOverdueTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    if (task.status !== "done" && task.dueDate) {
      const due = new Date(task.dueDate);
      due.setHours(0, 0, 0, 0);
      if (due < today) {
        // Task is overdue
        if (!task.notified) {
          showNotification(`Task "${task.title}" is overdue!`, "warning");
          task.notified = true;
          saveTasks();
        }
      }
    }
  });
}

// Archive completed tasks
function archiveCompletedTasks() {
  const completedTasks = tasks.filter((task) => task.status === "done");
  if (completedTasks.length === 0) {
    showNotification("No completed tasks to archive.", "info");
    return;
  }

  // Move to archived
  archivedTasks = [...archivedTasks, ...completedTasks];

  // Remove from active tasks
  tasks = tasks.filter((task) => task.status !== "done");

  saveTasks();
  renderTasks();
  updateStats();

  showNotification(
    `Archived ${completedTasks.length} completed task(s)!`,
    "success"
  );
}

// Show archived tasks
function showArchivedTasks() {
  if (archivedTasks.length === 0) {
    showNotification("No archived tasks to show.", "info");
    return;
  }

  // Create a modal to show archived tasks
  const modal = document.createElement("div");
  modal.className = "modal-overlay active";
  modal.innerHTML = `
    <div class="task-modal">
      <button class="close-modal" id="close-archived-modal">×</button>
      <h2>Archived Tasks (${archivedTasks.length})</h2>
      <div class="archived-tasks-list">
        ${archivedTasks
          .map(
            (task) => `
          <div class="archived-task">
            <h3>${task.title}</h3>
            <p>${task.description || "No description"}</p>
            <div class="archived-task-meta">
              <span>Completed on: ${new Date(
                task.dateAdded
              ).toLocaleDateString()}</span>
              <button class="btn-icon restore-task" data-id="${
                task.id
              }" title="Restore task">
                <i class="fas fa-undo"></i>
              </button>
            </div>
          </div>
        `
          )
          .join("")}
      </div>
      <div class="modal-actions">
        <button class="btn-danger" id="clear-archived">
          <i class="fas fa-trash"></i>Clear All Archived
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add event listeners
  modal.querySelector("#close-archived-modal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.querySelectorAll(".restore-task").forEach((btn) => {
    btn.addEventListener("click", () => {
      const taskId = btn.dataset.id;
      const taskIndex = archivedTasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        const task = archivedTasks[taskIndex];
        task.status = "todo";
        task.archived = false;
        tasks.push(task);
        archivedTasks.splice(taskIndex, 1);
        saveTasks();
        renderTasks();
        updateStats();
        showNotification("Task restored!", "success");

        // Update the modal or close if empty
        if (archivedTasks.length === 0) {
          document.body.removeChild(modal);
        } else {
          // Refresh the modal content
          document.body.removeChild(modal);
          showArchivedTasks();
        }
      }
    });
  });

  modal.querySelector("#clear-archived").addEventListener("click", () => {
    if (
      confirm(
        "Are you sure you want to permanently delete all archived tasks? This cannot be undone."
      )
    ) {
      archivedTasks = [];
      saveTasks();
      document.body.removeChild(modal);
      showNotification("All archived tasks have been deleted.", "info");
    }
  });
}

// Clear completed tasks
function clearCompletedTasks() {
  const completedTasks = tasks.filter((task) => task.status === "done");
  if (completedTasks.length === 0) {
    showNotification("No completed tasks to clear.", "info");
    return;
  }

  if (
    confirm(
      `Are you sure you want to delete ${completedTasks.length} completed task(s)? This cannot be undone.`
    )
  ) {
    tasks = tasks.filter((task) => task.status !== "done");
    saveTasks();
    renderTasks();
    updateStats();
    showNotification("Completed tasks cleared!", "success");
  }
}

// Export tasks
function exportTasks() {
  const dataStr =
    "data:text/json;charset=utf-8," +
    encodeURIComponent(
      JSON.stringify(
        {
          tasks: tasks,
          archivedTasks: archivedTasks,
          exportDate: new Date().toISOString(),
        },
        null,
        2
      )
    );
  const downloadAnchorNode = document.createElement("a");
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute(
    "download",
    `schedulepro-backup-${new Date().toISOString().split("T")[0]}.json`
  );
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
  showNotification("Tasks exported successfully!", "success");
}

// Import tasks
function importTasks(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const data = JSON.parse(e.target.result);
      if (data.tasks) {
        if (
          confirm(
            "This will replace your current tasks. Are you sure you want to continue?"
          )
        ) {
          tasks = data.tasks;
          archivedTasks = data.archivedTasks || [];
          saveTasks();
          renderTasks();
          updateStats();
          showNotification("Tasks imported successfully!", "success");
        }
      } else {
        showNotification("Invalid file format.", "error");
      }
    } catch (error) {
      showNotification("Error importing tasks: " + error.message, "error");
    }
  };
  reader.readAsText(file);
  // Reset the file input
  e.target.value = "";
}

// Open task edit modal
function openEditTaskModal(task) {
  currentEditingTaskId = task.id;

  // Populate modal fields
  modalTitle.textContent = "Edit Task";
  modalTaskTitle.value = task.title;
  modalTaskDescription.value = task.description || "";
  modalTaskDueDate.value = task.dueDate || "";
  modalTaskRecurrence.value = task.recurrence || "none";
  modalTaskDifficulty.value = task.difficulty || "easy";

  // Set importance
  document
    .querySelectorAll("#task-modal-overlay .importance-option")
    .forEach((option) => {
      option.classList.remove("selected");
      if (parseInt(option.dataset.importance) === task.importance) {
        option.classList.add("selected");
      }
    });

  // Set tags
  Array.from(modalTaskTags.options).forEach((option) => {
    option.selected = task.tags && task.tags.includes(option.value);
  });

  // Render checkpoints
  modalCheckpoints.innerHTML = "";
  if (task.checkpoints && task.checkpoints.length > 0) {
    task.checkpoints.forEach((checkpoint, index) => {
      const checkpointEl = document.createElement("div");
      checkpointEl.className = "checkpoint";
      checkpointEl.innerHTML = `
        <input type="checkbox" id="modal-checkpoint-${index}" ${
        checkpoint.completed ? "checked" : ""
      }>
        <label for="modal-checkpoint-${index}">${checkpoint.text}</label>
      `;
      modalCheckpoints.appendChild(checkpointEl);

      // Add event listener to update task when checkpoint is toggled
      checkpointEl.querySelector("input").addEventListener("change", (e) => {
        task.checkpoints[index].completed = e.target.checked;

        // Recalculate progress
        const completed = task.checkpoints.filter((cp) => cp.completed).length;
        task.progress = task.checkpoints.length
          ? Math.round((completed / task.checkpoints.length) * 100)
          : 0;

        saveTasks();
        renderTasks();
        updateStats();
      });
    });
  } else {
    modalCheckpoints.innerHTML = "<p>No checkpoints defined</p>";
  }

  // Show modal
  taskModalOverlay.classList.add("active");
}

// Close task modal
function closeTaskModal() {
  taskModalOverlay.classList.remove("active");
}

// Update task from modal
function updateTask() {
  if (!currentEditingTaskId) return;

  const taskIndex = tasks.findIndex((t) => t.id === currentEditingTaskId);
  if (taskIndex === -1) return;

  tasks[taskIndex].title = modalTaskTitle.value;
  tasks[taskIndex].description = modalTaskDescription.value;
  tasks[taskIndex].dueDate = modalTaskDueDate.value;
  tasks[taskIndex].recurrence = modalTaskRecurrence.value;
  tasks[taskIndex].difficulty = modalTaskDifficulty.value;

  // Update importance
  const selectedImportance = document.querySelector(
    "#task-modal-overlay .importance-option.selected"
  );
  if (selectedImportance) {
    tasks[taskIndex].importance = parseInt(
      selectedImportance.dataset.importance
    );
  }

  // Update tags
  tasks[taskIndex].tags = Array.from(modalTaskTags.selectedOptions).map(
    (option) => option.value
  );

  saveTasks();
  renderTasks();
  closeTaskModal();
  updateStats();

  showNotification("Task updated successfully!", "success");
}

// Delete task
function deleteTask() {
  if (!currentEditingTaskId) return;

  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter((task) => task.id !== currentEditingTaskId);
    saveTasks();
    renderTasks();
    closeTaskModal();
    updateStats();

    showNotification("Task deleted successfully!", "success");
  }
}

// Delete task by ID
function deleteTaskById(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  if (confirm(`Are you sure you want to delete the task "${task.title}"?`)) {
    tasks = tasks.filter((t) => t.id !== taskId);
    saveTasks();
    renderTasks();
    updateStats();

    showNotification("Task deleted successfully!", "success");
  }
}

// Save tasks to storage
function saveTasks() {
  if (currentUser) {
    // Save to Firebase if user is logged in
    const userRef = db.collection("users").doc(currentUser.uid);
    userRef.set({
      tasks: tasks,
      archivedTasks: archivedTasks,
      lastUpdated: new Date().toISOString(),
    });
  } else {
    // Save to localStorage if user is not logged in
    localStorage.setItem("schedulepro-tasks", JSON.stringify(tasks));
    localStorage.setItem(
      "schedulepro-archived-tasks",
      JSON.stringify(archivedTasks)
    );
  }
}

// Load user tasks from Firebase
function loadUserTasks() {
  if (!currentUser) return;

  const userRef = db.collection("users").doc(currentUser.uid);
  userRef
    .get()
    .then((doc) => {
      if (doc.exists) {
        const data = doc.data();
        tasks = data.tasks || [];
        archivedTasks = data.archivedTasks || [];
        renderTasks();
        updateStats();
      } else {
        // No data found, initialize with empty arrays
        tasks = [];
        archivedTasks = [];
      }
    })
    .catch((error) => {
      console.error("Error loading tasks:", error);
      showNotification("Error loading your tasks.", "error");
    });
}

// Open help modal
function openHelpModal() {
  helpModalOverlay.classList.add("active");
}

// Close help modal
function closeHelpModalWindow() {
  helpModalOverlay.classList.remove("active");
}

// Open auth modal
function openAuthModal() {
  authModalOverlay.classList.add("active");
}

// Close auth modal
function closeAuthModalWindow() {
  authModalOverlay.classList.remove("active");
}

// Switch between login and signup forms
function switchAuthMode(mode) {
  authModalMode = mode;

  if (mode === "login") {
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    authModalTitle.textContent = "Login";
  } else {
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
    authModalTitle.textContent = "Register";
  }
}

// Handle login
function handleLogin(e) {
  e.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  if (!email || !password) {
    showNotification("Please enter both email and password.", "error");
    return;
  }

  loginBtn.disabled = true;
  loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      showNotification("Login successful!", "success");
      closeAuthModalWindow();
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    })
    .catch((error) => {
      console.error("Login error:", error);
      showNotification("Login failed: " + error.message, "error");
      loginBtn.disabled = false;
      loginBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
    });
}

// Handle signup
function handleSignup(e) {
  e.preventDefault();

  const username = signupUsername.value;
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;

  if (!username || !email || !password || !confirmPassword) {
    showNotification("Please fill in all fields.", "error");
    return;
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match.", "error");
    return;
  }

  if (password.length < 6) {
    showNotification("Password should be at least 6 characters.", "error");
    return;
  }

  registerBtn.disabled = true;
  registerBtn.innerHTML =
    '<i class="fas fa-spinner fa-spin"></i> Registering...';

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Update user profile with username
      return userCredential.user.updateProfile({
        displayName: username,
      });
    })
    .then(() => {
      showNotification("Registration successful!", "success");
      closeAuthModalWindow();
      registerBtn.disabled = false;
      registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Register';
    })
    .catch((error) => {
      console.error("Signup error:", error);
      showNotification("Registration failed: " + error.message, "error");
      registerBtn.disabled = false;
      registerBtn.innerHTML = '<i class="fas fa-user-plus"></i> Register';
    });
}

// Sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth
    .signInWithPopup(provider)
    .then((result) => {
      showNotification("Login successful!", "success");
      closeAuthModalWindow();
    })
    .catch((error) => {
      console.error("Google signin error:", error);
      showNotification("Google login failed: " + error.message, "error");
    });
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
  authBtn.innerHTML = `<i class="fas fa-user"></i>${
    user.displayName || "Profile"
  }`;
  authBtn.classList.remove("btn-primary");
  authBtn.classList.add("btn-success");

  // Add logout functionality
  authBtn.onclick = () => {
    if (confirm("Are you sure you want to logout?")) {
      auth.signOut();
    }
  };
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
  authBtn.innerHTML = '<i class="fas fa-user"></i>Login';
  authBtn.classList.remove("btn-success");
  authBtn.classList.add("btn-primary");
  authBtn.onclick = openAuthModal;
}

// Show notification
function showNotification(message, type = "info") {
  notificationMessage.textContent = message;
  notification.className = "notification";

  switch (type) {
    case "success":
      notification.classList.add("success");
      notificationIcon.className = "fas fa-check-circle";
      break;
    case "error":
      notification.classList.add("error");
      notificationIcon.className = "fas fa-exclamation-circle";
      break;
    case "warning":
      notification.classList.add("warning");
      notificationIcon.className = "fas fa-exclamation-triangle";
      break;
    default:
      notificationIcon.className = "fas fa-info-circle";
  }

  notification.classList.add("show");

  // Auto hide after 5 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 5000);
}

// Helper function to get tag color
function getTagColor(tag) {
  const colors = {
    Work: "#4a6fa5",
    Personal: "#6a4a9c",
    Urgent: "#c94a4a",
  };
  return colors[tag] || "#6c757d";
}

// Generate task code
function generateTaskCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
