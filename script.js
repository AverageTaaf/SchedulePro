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
const profileModalOverlay = document.getElementById("profile-modal-overlay");
const closeProfileModal = document.getElementById("close-profile-modal");
const profileName = document.getElementById("profile-name");
const profileEmail = document.getElementById("profile-email");
const profilePassword = document.getElementById("profile-password");
const logoutBtn = document.getElementById("logout-btn");
const updateProfileBtn = document.getElementById("update-profile");
const notification = document.getElementById("notification");
const notificationMessage = document.getElementById("notification-message");
const notificationAction = document.getElementById("notification-action");
const notificationIcon = document.getElementById("notification-icon");
const importanceOptions = document.querySelectorAll(".importance-option");

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

// Initialize Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

// Initialize the application
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

  // Profile modal
  closeProfileModal.addEventListener("click", () => {
    profileModalOverlay.classList.remove("active");
  });
  logoutBtn.addEventListener("click", logout);
  updateProfileBtn.addEventListener("click", updateProfile);

  // Notification
  notificationAction.addEventListener("click", () => {
    notification.classList.remove("show");
  });

  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target === taskModalOverlay) closeTaskModal();
    if (e.target === helpModalOverlay) closeHelpModalWindow();
    if (e.target === authModalOverlay) closeAuthModalWindow();
    if (e.target === profileModalOverlay)
      profileModalOverlay.classList.remove("active");
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
  tasks[taskIndex].checkpoints = checkpoints;

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

  // Set today's date as default for due date
  const today = new Date().toISOString().split("T")[0];
  taskDueDate.value = today;

  taskDifficulty.value = "easy";
  taskRecurrence.value = "none";
  taskCheckpoints.value = "";

  // Reset importance to default
  importanceOptions.forEach((option) => {
    option.classList.remove("selected");
    if (parseInt(option.dataset.importance) === 1) {
      option.classList.add("selected");
    }
  });
  currentImportance = 1;

  // Reset tags
  Array.from(taskTags.options).forEach((option) => {
    option.selected = false;
  });

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
  taskRecurrence.value = task.recurrence || "none";
  taskCheckpoints.value = task.checkpoints.map((c) => c.text).join("\n");

  // Set importance
  importanceOptions.forEach((option) => {
    option.classList.remove("selected");
    if (parseInt(option.dataset.importance) === task.importance) {
      option.classList.add("selected");
    }
  });
  currentImportance = task.importance;

  // Set tags
  Array.from(taskTags.options).forEach((option) => {
    option.selected = task.tags && task.tags.includes(option.value);
  });

  saveTaskBtn.disabled = false;

  // Scroll to form
  document.querySelector(".task-form").scrollIntoView({ behavior: "smooth" });

  // Expand form if collapsed
  if (formCollapsed) {
    toggleForm();
  }
}

// Open task modal
function openTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  currentEditingTaskId = taskId;

  // Populate modal
  modalTitle.textContent = task.title;
  modalTaskTitle.value = task.title;
  modalTaskDescription.value = task.description;
  modalTaskDueDate.value = task.dueDate;
  modalTaskDifficulty.value = task.difficulty;
  modalTaskRecurrence.value = task.recurrence || "none";

  // Set tags
  if (task.tags && task.tags.length > 0) {
    Array.from(modalTaskTags.options).forEach((option) => {
      option.selected = task.tags.includes(option.value);
    });
  } else {
    Array.from(modalTaskTags.options).forEach((option) => {
      option.selected = false;
    });
  }

  // Set importance
  const modalImportanceOptions =
    document.querySelectorAll(".importance-option");
  modalImportanceOptions.forEach((option) => {
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

// Update task from modal
function updateTask() {
  if (!currentEditingTaskId) return;

  const taskIndex = tasks.findIndex((t) => t.id === currentEditingTaskId);
  if (taskIndex === -1) return;

  // Update task properties
  tasks[taskIndex].title = modalTaskTitle.value;
  tasks[taskIndex].description = modalTaskDescription.value;
  tasks[taskIndex].dueDate = modalTaskDueDate.value;
  tasks[taskIndex].difficulty = modalTaskDifficulty.value;
  tasks[taskIndex].recurrence = modalTaskRecurrence.value;
  tasks[taskIndex].tags = Array.from(modalTaskTags.selectedOptions).map(
    (option) => option.value
  );

  // Update importance
  const selectedImportance = document.querySelector(
    ".importance-option.selected"
  );
  if (selectedImportance) {
    tasks[taskIndex].importance = parseInt(
      selectedImportance.dataset.importance
    );
  }

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

// Save tasks to localStorage and Firestore
function saveTasks() {
  if (currentUser) {
    // Save to Firestore
    const userTasksRef = db
      .collection("users")
      .doc(currentUser.uid)
      .collection("tasks");

    // Clear all existing tasks
    userTasksRef
      .get()
      .then((snapshot) => {
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
          batch.delete(doc.ref);
        });

        return batch.commit();
      })
      .then(() => {
        // Add all current tasks
        const batch = db.batch();
        tasks.forEach((task) => {
          const taskRef = userTasksRef.doc(task.id);
          batch.set(taskRef, task);
        });

        return batch.commit();
      })
      .then(() => {
        console.log("Tasks saved to Firestore");
      })
      .catch((error) => {
        console.error("Error saving tasks to Firestore: ", error);
      });
  } else {
    // Save to localStorage
    localStorage.setItem("schedulepro-tasks", JSON.stringify(tasks));
  }
}

// Render tasks to the UI
function renderTasks() {
  // Filter tasks based on current search and filter
  let filteredTasks = tasks.filter((task) => {
    // Search filter
    const matchesSearch =
      !currentSearch ||
      task.title.toLowerCase().includes(currentSearch) ||
      task.description.toLowerCase().includes(currentSearch) ||
      task.taskCode.includes(currentSearch);

    // Tag filter
    const matchesTag =
      currentTagFilter === "all" ||
      (task.tags && task.tags.includes(currentTagFilter));

    // Status filter
    let matchesStatus = true;
    if (currentFilter === "active") {
      matchesStatus = task.status !== "done";
    } else if (currentFilter === "completed") {
      matchesStatus = task.status === "done";
    }

    return matchesSearch && matchesTag && matchesStatus;
  });

  // Sort tasks
  const sortValue = sortSelect.value;
  filteredTasks.sort((a, b) => {
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

  // Clear lists
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

  // Check if we have any tasks at all
  if (filteredTasks.length === 0) {
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
  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "in-progress"
  );
  const doneTasks = filteredTasks.filter((t) => t.status === "done");

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

  // Setup drag and drop
  setupDragAndDrop();
}

// Create task element
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-widget";
  taskElement.dataset.id = task.id;
  taskElement.draggable = true;

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

  // Create tags HTML
  let tagsHTML = "";
  if (task.tags && task.tags.length > 0) {
    tagsHTML = `<div class="task-tags">${task.tags
      .map((tag) => `<span class="task-tag">${tag}</span>`)
      .join("")}</div>`;
  }

  taskElement.innerHTML = `
        <h3>${task.title} <span class="importance-label importance-${
    task.importance
  }-label">Level ${task.importance}</span></h3>
        <p>${task.description.substring(0, 80)}${
    task.description.length > 80 ? "..." : ""
  }</p>
        ${tagsHTML}
        <div class="task-meta">
            <span class="${
              isOverdue ? "overdue" : isDueSoon ? "due-soon" : ""
            }">${formatDate(task.dueDate)}</span>
            <span class="difficulty difficulty-${task.difficulty}">${
    task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)
  }</span>
        </div>
        <div class="task-code">Task Code: ${task.taskCode}</div>
        <div class="importance importance-${task.importance}">
            ${importanceDots}
        </div>
        <div class="progress-container">
            <div class="progress-bar" style="width: ${task.progress}%"></div>
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

  // Drag events
  taskElement.addEventListener("dragstart", () => {
    taskElement.classList.add("dragging");
  });

  taskElement.addEventListener("dragend", () => {
    taskElement.classList.remove("dragging");
  });

  return taskElement;
}

// Update stats
function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;
  const inProgress = tasks.filter((t) => t.status === "in-progress").length;

  // Fix overdue calculation - only count tasks that are not completed and past due date
  const today = new Date();
  const overdue = tasks.filter((t) => {
    const dueDate = new Date(t.dueDate);
    return dueDate < today && t.status !== "done";
  }).length;

  totalTasksEl.textContent = total;
  completedTasksEl.textContent = completed;
  inprogressTasksEl.textContent = inProgress;
  overdueTasksEl.textContent = overdue;
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

// Archive completed tasks
function archiveCompletedTasks() {
  const completedTasks = tasks.filter((t) => t.status === "done");
  archivedTasks = [...archivedTasks, ...completedTasks];
  tasks = tasks.filter((t) => t.status !== "done");

  localStorage.setItem(
    "schedulepro-archived-tasks",
    JSON.stringify(archivedTasks)
  );
  saveTasks();
  renderTasks();
  updateStats();

  showNotification(
    `${completedTasks.length} tasks archived successfully!`,
    "success"
  );
}

// Show archived tasks
function showArchivedTasks() {
  // Create modal for archived tasks
  const archiveModal = document.createElement("div");
  archiveModal.className = "modal-overlay active";
  archiveModal.innerHTML = `
        <div class="task-modal">
            <button class="close-modal" id="close-archive-modal">×</button>
            <h2>Archived Tasks</h2>
            <div class="archived-tasks-list">
                ${
                  archivedTasks.length > 0
                    ? archivedTasks
                        .map(
                          (task) => `
                    <div class="archived-task">
                        <h3>${task.title}</h3>
                        <p>Completed on: ${new Date(
                          task.dateAdded
                        ).toLocaleDateString()}</p>
                    </div>
                `
                        )
                        .join("")
                    : "<p>No archived tasks yet.</p>"
                }
            </div>
        </div>
    `;

  document.body.appendChild(archiveModal);

  // Add event listener to close button
  document
    .getElementById("close-archive-modal")
    .addEventListener("click", () => {
      document.body.removeChild(archiveModal);
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

// Export tasks
function exportTasks() {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = "schedulepro-tasks.json";

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();

  showNotification("Tasks exported successfully!", "success");
}

// Import tasks
function importTasks(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedTasks = JSON.parse(e.target.result);

      // Check if it's the right format
      if (Array.isArray(importedTasks)) {
        tasks = importedTasks;
        saveTasks();
        renderTasks();
        updateStats();
        showNotification("Tasks imported successfully!", "success");
      } else if (Array.isArray(importedTasks.tasks)) {
        tasks = importedTasks.tasks;
        saveTasks();
        renderTasks();
        updateStats();
        showNotification("Tasks imported successfully!", "success");
      } else {
        showNotification("Invalid file format!", "error");
      }
    } catch (error) {
      showNotification("Error importing tasks!", "error");
      console.error(error);
    }
  };
  reader.readAsText(file);

  // Reset file input
  event.target.value = "";
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

// Generate unique task code
function generateTaskCode() {
  return Math.random().toString().substring(2, 12);
}

// Format date
function formatDate(dateString) {
  const options = { year: "numeric", month: "short", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
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
    notificationIcon.className = "fas fa-exclamation-triangle";
  } else {
    notification.style.backgroundColor = "var(--primary)";
    notificationIcon.className = "fas fa-info-circle";
  }

  notification.classList.add("show");

  // Auto hide after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
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

// Switch auth mode (login/signup)
function switchAuthMode(mode) {
  authModalMode = mode;

  if (mode === "signup") {
    loginForm.style.display = "none";
    signupForm.style.display = "block";
    authModalTitle.textContent = "Create Account";
  } else {
    loginForm.style.display = "block";
    signupForm.style.display = "none";
    authModalTitle.textContent = "Login to Your Account";
  }
}

// Handle login
function handleLogin(e) {
  e.preventDefault();

  const email = loginEmail.value;
  const password = loginPassword.value;

  loginBtn.disabled = true;
  loginBtn.textContent = "Logging in...";

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Login successful
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      closeAuthModalWindow();
      showNotification("Login successful!", "success");
    })
    .catch((error) => {
      // Login failed
      loginBtn.disabled = false;
      loginBtn.textContent = "Login";
      showNotification(error.message, "error");
    });
}

// Handle signup
function handleSignup(e) {
  e.preventDefault();

  const username = signupUsername.value;
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;

  if (password !== confirmPassword) {
    showNotification("Passwords do not match!", "error");
    return;
  }

  registerBtn.disabled = true;
  registerBtn.textContent = "Creating Account...";

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Add username to user profile
      return userCredential.user.updateProfile({
        displayName: username,
      });
    })
    .then(() => {
      // Create user document in Firestore
      return db.collection("users").doc(auth.currentUser.uid).set({
        username: username,
        email: email,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
    })
    .then(() => {
      // Signup successful
      registerBtn.disabled = false;
      registerBtn.textContent = "Create Account";
      closeAuthModalWindow();
      showNotification("Account created successfully!", "success");
    })
    .catch((error) => {
      // Signup failed
      registerBtn.disabled = false;
      registerBtn.textContent = "Create Account";
      showNotification(error.message, "error");
    });
}

// Sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth
    .signInWithPopup(provider)
    .then((result) => {
      // Check if user is new
      if (result.additionalUserInfo.isNewUser) {
        // Create user document in Firestore
        return db.collection("users").doc(result.user.uid).set({
          username: result.user.displayName,
          email: result.user.email,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      }
    })
    .then(() => {
      closeAuthModalWindow();
      showNotification("Login successful!", "success");
    })
    .catch((error) => {
      showNotification(error.message, "error");
    });
}

// Logout
function logout() {
  auth
    .signOut()
    .then(() => {
      showNotification("Logged out successfully!", "success");
      profileModalOverlay.classList.remove("active");
    })
    .catch((error) => {
      showNotification(error.message, "error");
    });
}

// Update profile
function updateProfile() {
  const newName = profileName.value;
  const newEmail = profileEmail.value;
  const newPassword = profilePassword.value;

  updateProfileBtn.disabled = true;
  updateProfileBtn.textContent = "Updating...";

  const promises = [];

  if (newName !== currentUser.displayName) {
    promises.push(currentUser.updateProfile({ displayName: newName }));
  }

  if (newEmail !== currentUser.email) {
    promises.push(currentUser.updateEmail(newEmail));
  }

  if (newPassword) {
    promises.push(currentUser.updatePassword(newPassword));
  }

  Promise.all(promises)
    .then(() => {
      updateProfileBtn.disabled = false;
      updateProfileBtn.textContent = "Update Profile";
      showNotification("Profile updated successfully!", "success");
    })
    .catch((error) => {
      updateProfileBtn.disabled = false;
      updateProfileBtn.textContent = "Update Profile";
      showNotification(error.message, "error");
    });
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
  authBtn.innerHTML = `<i class="fas fa-user"></i> ${
    user.displayName || "User"
  }`;
  authBtn.removeEventListener("click", openAuthModal);
  authBtn.addEventListener("click", () => {
    profileName.value = user.displayName || "";
    profileEmail.value = user.email || "";
    profilePassword.value = "";
    profileModalOverlay.classList.add("active");
  });
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
  authBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login';
  authBtn.removeEventListener("click", () => {});
  authBtn.addEventListener("click", openAuthModal);
}

// Load user tasks from Firestore
function loadUserTasks() {
  if (!currentUser) return;

  const userTasksRef = db
    .collection("users")
    .doc(currentUser.uid)
    .collection("tasks");

  userTasksRef
    .get()
    .then((querySnapshot) => {
      tasks = [];
      querySnapshot.forEach((doc) => {
        tasks.push(doc.data());
      });

      renderTasks();
      updateStats();
    })
    .catch((error) => {
      console.error("Error loading tasks: ", error);
      // Fallback to local storage if Firestore fails
      tasks = JSON.parse(localStorage.getItem("schedulepro-tasks")) || [];
      renderTasks();
      updateStats();
    });
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", init);
