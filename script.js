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
const authBtn = document.getElementById("auth-btn");
const authModalOverlay = document.getElementById("auth-modal-overlay");
const closeAuthModal = document.getElementById("close-auth-modal");
const authModalTitle = document.getElementById("auth-modal-title");
const loginForm = document.getElementById("login-form");
const signupForm = document.getElementById("signup-form");
const switchToSignup = document.getElementById("switch-to-signup");
const switchToLogin = document.getElementById("switch-to-login");
const authStatus = document.getElementById("auth-status");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById(
  "signup-confirm-password"
);
const forgotPasswordLink = document.getElementById("forgot-password");
const forgotPasswordForm = document.getElementById("forgot-password-form");
const switchToLoginFromForgot = document.getElementById(
  "switch-to-login-from-forgot"
);
const resetEmail = document.getElementById("reset-email");

const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");
const archiveList = document.getElementById("archive-list");

// New DOM Elements for Additional Features
const searchInput = document.getElementById("search-input");
const calendarViewBtn = document.getElementById("calendar-view-btn");
const calendarModalOverlay = document.getElementById("calendar-modal-overlay");
const closeCalendarModal = document.getElementById("close-calendar-modal");
const calendarMonthYear = document.getElementById("calendar-month-year");
const calendarGrid = document.getElementById("calendar-grid");
const prevMonthBtn = document.getElementById("prev-month");
const nextMonthBtn = document.getElementById("next-month");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");
const settingsBtn = document.getElementById("settings-btn");
const settingsModalOverlay = document.getElementById("settings-modal-overlay");
const closeSettingsModal = document.getElementById("close-settings-modal");
const saveSettingsBtn = document.getElementById("save-settings");
const defaultSort = document.getElementById("default-sort");
const defaultFilter = document.getElementById("default-filter");
const reminderTime = document.getElementById("reminder-time");
const profilePicture = document.getElementById("profile-picture");
const displayName = document.getElementById("display-name");
const insightsBtn = document.getElementById("insights-btn");
const insightsModalOverlay = document.getElementById("insights-modal-overlay");
const closeInsightsModal = document.getElementById("close-insights-modal");
const weeklyCompletedEl = document.getElementById("weekly-completed");
const completionRateEl = document.getElementById("completion-rate");
const currentStreakEl = document.getElementById("current-streak");
const productiveDayEl = document.getElementById("productive-day");
const productivityChart = document.getElementById("productivity-chart");
const showArchiveBtn = document.getElementById("show-archive-btn");
const projectFilter = document.getElementById("project-filter");
const tagFilter = document.getElementById("tag-filter");
const taskRecurrence = document.getElementById("task-recurrence");
const taskProject = document.getElementById("task-project");
const taskTags = document.getElementById("task-tags");
const addProjectBtn = document.getElementById("add-project-btn");
const projectModalOverlay = document.getElementById("project-modal-overlay");
const closeProjectModal = document.getElementById("close-project-modal");
const saveProjectBtn = document.getElementById("save-project");
const projectName = document.getElementById("project-name");
const projectColor = document.getElementById("project-color");
const priorityFilterBtns = document.querySelectorAll(".priority-filter-btn");

// State
let tasks = JSON.parse(localStorage.getItem("schedulepro-tasks")) || [];
let currentEditingTaskId = null;
let currentImportance = 1;
let darkMode = localStorage.getItem("schedulepro-darkmode") === "true";
let formCollapsed = false;
let currentUser = null;
let authModalMode = "login";

// New State Variables
let userSettings = JSON.parse(localStorage.getItem("schedulepro-settings")) || {
  defaultSort: "date-added-desc",
  defaultFilter: "all",
  reminderTime: 30,
  profilePicture: null,
  displayName: "",
};

let projects = JSON.parse(localStorage.getItem("schedulepro-projects")) || [];
let tags = JSON.parse(localStorage.getItem("schedulepro-tags")) || [];
let completedStreak = parseInt(localStorage.getItem("schedulepro-streak")) || 0;
let lastCompletedDate = localStorage.getItem("schedulepro-last-completed");
let currentCalendarDate = new Date();

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
const auth = firebase.auth();
const db = firebase.firestore();

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
    }
    updateStats();
  });

  // Load user settings
  loadUserSettings();

  // Load projects and tags
  renderProjectFilter();
  renderTagFilter();
  renderProjectSelect();

  // Check for reminders
  checkReminders();

  // Check streak
  checkStreak();

  // Update progress visualization
  updateProgressVisualization();
}

// Update UI for logged in user
function updateUIForLoggedInUser(user) {
  const displayName = user.displayName || user.email.split("@")[0];
  authBtn.innerHTML = `<i class="fas fa-user"></i>${displayName}`;
  authBtn.id = "user-menu-btn";

  if (!document.getElementById("user-dropdown")) {
    const userDropdown = document.createElement("div");
    userDropdown.id = "user-dropdown";
    userDropdown.className = "user-dropdown";
    userDropdown.innerHTML = `
      <div class="user-dropdown-header">
        ${
          userSettings.profilePicture
            ? `<img src="${userSettings.profilePicture}" class="user-dropdown-avatar" alt="Profile">`
            : `<div class="user-dropdown-avatar-initials">${displayName
                .charAt(0)
                .toUpperCase()}</div>`
        }
        <h3>${displayName}</h3>
      </div>
      <hr>
      <button class="btn-warning" id="logout-btn">
        <i class="fas fa-sign-out-alt"></i>Logout
      </button>
    `;
    document.body.appendChild(userDropdown);

    document.getElementById("logout-btn").addEventListener("click", logout);

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !e.target.closest("#user-menu-btn") &&
        !e.target.closest("#user-dropdown")
      ) {
        userDropdown.classList.remove("active");
      }
    });
  }
}

// Update UI for logged out user
function updateUIForLoggedOutUser() {
  authBtn.innerHTML = '<i class="fas fa-user"></i>Login';
  authBtn.id = "auth-btn";

  // Remove user dropdown if exists
  const userDropdown = document.getElementById("user-dropdown");
  if (userDropdown) {
    userDropdown.remove();
  }
}

// Toggle user dropdown
function toggleUserDropdown() {
  const dropdown = document.getElementById("user-dropdown");
  dropdown.classList.toggle("active");
}

// Toggle form visibility with animation
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
  authBtn.addEventListener("click", openAuthModal);
  closeAuthModal.addEventListener("click", closeAuthModalWindow);
  switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthMode("signup");
  });
  switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthMode("login");
  });
  loginForm.addEventListener("submit", handleLogin);
  signupForm.addEventListener("submit", handleSignup);
  forgotPasswordLink.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthMode("forgot");
  });
  switchToLoginFromForgot.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthMode("login");
  });
  forgotPasswordForm.addEventListener("submit", handlePasswordReset);

  // Password validation listeners
  signupPassword.addEventListener("input", validatePasswordRequirements);
  signupConfirmPassword.addEventListener("input", validatePasswordMatch);

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

  // New event listeners for additional features
  searchInput.addEventListener("input", debounce(searchTasks, 300));
  calendarViewBtn.addEventListener("click", openCalendarView);
  closeCalendarModal.addEventListener("click", closeCalendarView);
  prevMonthBtn.addEventListener("click", showPreviousMonth);
  nextMonthBtn.addEventListener("click", showNextMonth);
  exportBtn.addEventListener("click", exportTasks);
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importTasks);
  settingsBtn.addEventListener("click", openSettings);
  closeSettingsModal.addEventListener("click", closeSettings);
  saveSettingsBtn.addEventListener("click", saveSettings);
  profilePicture.addEventListener("change", handleProfilePictureUpload);
  insightsBtn.addEventListener("click", openInsights);
  closeInsightsModal.addEventListener("click", closeInsights);
  showArchiveBtn.addEventListener("click", toggleArchive);
  projectFilter.addEventListener("change", filterByProject);
  tagFilter.addEventListener("change", filterByTag);
  taskRecurrence.addEventListener("change", toggleRecurrenceOptions);
  addProjectBtn.addEventListener("click", openAddProjectModal);
  closeProjectModal.addEventListener("click", closeAddProjectModal);
  saveProjectBtn.addEventListener("click", saveProject);

  // Priority filters
  priorityFilterBtns.forEach((btn) => {
    btn.addEventListener("click", (e) =>
      filterByPriority(e.target.dataset.priority)
    );
  });

  // Notification permission
  if ("Notification" in window) {
    Notification.requestPermission();
  }
}

// Open help modal
function openHelpModal() {
  helpModalOverlay.classList.add("active");
}

// Close help modal
function closeHelpModalWindow() {
  helpModalOverlay.classList.remove("active");
}

// Authentication functions
function openAuthModal() {
  if (currentUser) {
    toggleUserDropdown();
    return;
  }
  authModalOverlay.classList.add("active");
}

function closeAuthModalWindow() {
  authModalOverlay.classList.remove("active");
  clearAuthForms();
}

function switchAuthMode(mode) {
  authModalMode = mode;

  if (mode === "login") {
    authModalTitle.textContent = "Login to SchedulePro";
    loginForm.classList.add("active");
    signupForm.classList.remove("active");
    forgotPasswordForm.classList.remove("active");
  } else if (mode === "signup") {
    authModalTitle.textContent = "Create an Account";
    signupForm.classList.add("active");
    loginForm.classList.remove("active");
    forgotPasswordForm.classList.remove("active");
  } else if (mode === "forgot") {
    authModalTitle.textContent = "Reset Password";
    forgotPasswordForm.classList.add("active");
    loginForm.classList.remove("active");
    signupForm.classList.remove("active");
  }
}

function clearAuthForms() {
  loginForm.reset();
  signupForm.reset();
  forgotPasswordForm.reset();
  authStatus.style.display = "none";
  authStatus.className = "auth-status";
}

function showAuthMessage(message, type) {
  authStatus.textContent = message;
  authStatus.className = `auth-status ${type}`;
  authStatus.style.display = "block";
}

function handleLogin(e) {
  e.preventDefault();
  const email = loginEmail.value;
  const password = loginPassword.value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      showAuthMessage("Login successful! Loading your tasks...", "success");
      setTimeout(() => {
        closeAuthModalWindow();
      }, 1500);
    })
    .catch((error) => {
      console.error("Login error:", error);
      showAuthMessage(error.message, "error");
    });
}

function handleSignup(e) {
  e.preventDefault();
  const username = signupUsername.value;
  const email = signupEmail.value;
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;

  // Validate password
  if (password !== confirmPassword) {
    showAuthMessage("Passwords don't match", "error");
    return;
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    showAuthMessage("Password does not meet requirements", "error");
    return;
  }

  // Check if username is available
  db.collection("users")
    .where("username", "==", username)
    .get()
    .then((snapshot) => {
      if (!snapshot.empty) {
        showAuthMessage("Username already exists", "error");
        return;
      }

      // Create user
      auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredential) => {
          // Add username to user profile
          return userCredential.user
            .updateProfile({
              displayName: username,
            })
            .then(() => {
              // Save user data to Firestore
              return db.collection("users").doc(userCredential.user.uid).set({
                username: username,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });
        })
        .then(() => {
          showAuthMessage(
            "Account created successfully! Redirecting...",
            "success"
          );
          setTimeout(() => {
            closeAuthModalWindow();
          }, 1500);
        })
        .catch((error) => {
          console.error("Signup error:", error);
          showAuthMessage(error.message, "error");
        });
    })
    .catch((error) => {
      console.error("Username check error:", error);
      showAuthMessage("Error checking username availability", "error");
    });
}

function handlePasswordReset(e) {
  e.preventDefault();
  const email = resetEmail.value;

  auth
    .sendPasswordResetEmail(email)
    .then(() => {
      showAuthMessage(
        "Password reset email sent! Check your inbox.",
        "success"
      );
    })
    .catch((error) => {
      console.error("Password reset error:", error);
      showAuthMessage(error.message, "error");
    });
}

function validatePassword(password) {
  const minLength = password.length >= 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  return {
    isValid:
      minLength && hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar,
    minLength,
    hasUpperCase,
    hasLowerCase,
    hasNumber,
    hasSpecialChar,
  };
}

function validatePasswordRequirements() {
  const password = signupPassword.value;
  const validation = validatePassword(password);

  // Update requirement indicators
  document.getElementById("req-length").className = validation.minLength
    ? "valid"
    : "invalid";
  document.getElementById("req-upper").className = validation.hasUpperCase
    ? "valid"
    : "invalid";
  document.getElementById("req-lower").className = validation.hasLowerCase
    ? "valid"
    : "invalid";
  document.getElementById("req-number").className = validation.hasNumber
    ? "valid"
    : "invalid";
  document.getElementById("req-special").className = validation.hasSpecialChar
    ? "valid"
    : "invalid";
}

function validatePasswordMatch() {
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;
  const matchIndicator = document.getElementById("req-match");

  if (confirmPassword.length === 0) {
    matchIndicator.className = "";
  } else if (password === confirmPassword) {
    matchIndicator.className = "valid";
  } else {
    matchIndicator.className = "invalid";
  }
}

function logout() {
  auth.signOut().then(() => {
    tasks = [];
    renderTasks();
    updateStats();
  });
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

// Task management functions - Updated for Firestore
function loadUserTasks() {
  if (!currentUser) return;

  db.collection("users")
    .doc(currentUser.uid)
    .collection("tasks")
    .orderBy("dateAdded", "desc")
    .get()
    .then((snapshot) => {
      tasks = [];
      snapshot.forEach((doc) => {
        tasks.push({ id: doc.id, ...doc.data() });
      });
      renderTasks();
      updateStats();
      checkTaskReminders();
    })
    .catch((error) => {
      console.error("Error loading tasks: ", error);
      showNotification("Error loading tasks", "error");
    });
}

function saveTasks() {
  if (!currentUser) {
    // Fallback to localStorage if not logged in
    localStorage.setItem("schedulepro-tasks", JSON.stringify(tasks));
    return;
  }

  // For Firestore, we don't need to save all tasks at once
  // Each task is saved individually when added/updated
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
    projectId: taskProject.value || null,
    tags: taskTags.value
      ? taskTags.value.split(",").map((tag) => tag.trim())
      : [],
  };

  if (!currentUser) {
    // Save to localStorage if not logged in
    newTask.id = Date.now().toString();
    tasks.push(newTask);
    saveTasks();
    renderTasks();
    resetForm();
    updateStats();
    showNotification("Task added successfully!", "success");

    // Schedule recurring task if needed
    if (newTask.recurrence !== "none") {
      setupRecurringTask(newTask);
    }

    // Schedule reminders
    scheduleReminders(newTask);
    return;
  }

  // Save to Firestore
  db.collection("users")
    .doc(currentUser.uid)
    .collection("tasks")
    .add(newTask)
    .then((docRef) => {
      newTask.id = docRef.id;
      tasks.push(newTask);
      renderTasks();
      resetForm();
      updateStats();
      showNotification("Task added successfully!", "success");

      // Schedule reminder notification
      scheduleReminders(newTask);

      // Schedule recurring task if needed
      if (newTask.recurrence !== "none") {
        setupRecurringTask(newTask);
      }
    })
    .catch((error) => {
      console.error("Error adding task: ", error);
      showNotification("Error adding task", "error");
    });
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
  tasks[taskIndex].projectId = taskProject.value || null;
  tasks[taskIndex].tags = taskTags.value
    ? taskTags.value.split(",").map((tag) => tag.trim())
    : [];

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

  if (!currentUser) {
    // Update in localStorage if not logged in
    saveTasks();
    renderTasks();
    closeTaskModal();
    updateStats();
    showNotification("Task updated successfully!", "success");
    return;
  }

  // Update in Firestore
  const { id, ...taskData } = tasks[taskIndex];
  db.collection("users")
    .doc(currentUser.uid)
    .collection("tasks")
    .doc(id)
    .update(taskData)
    .then(() => {
      renderTasks();
      closeTaskModal();
      updateStats();
      showNotification("Task updated successfully!", "success");
    })
    .catch((error) => {
      console.error("Error updating task: ", error);
      showNotification("Error updating task", "error");
    });
}

// Delete task
function deleteTask() {
  if (!currentEditingTaskId) return;

  if (
    confirm(
      "Are you sure you want to delete this task? This action cannot be undone."
    )
  ) {
    const taskIndex = tasks.findIndex((t) => t.id === currentEditingTaskId);
    if (taskIndex === -1) return;

    if (!currentUser) {
      // Delete from localStorage if not logged in
      tasks = tasks.filter((t) => t.id !== currentEditingTaskId);
      saveTasks();
      renderTasks();
      closeTaskModal();
      updateStats();
      showNotification("Task deleted successfully!", "success");
      return;
    }

    // Delete from Firestore
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(currentEditingTaskId)
      .delete()
      .then(() => {
        tasks = tasks.filter((t) => t.id !== currentEditingTaskId);
        renderTasks();
        closeTaskModal();
        updateStats();
        showNotification("Task deleted successfully!", "success");
      })
      .catch((error) => {
        console.error("Error deleting task: ", error);
        showNotification("Error deleting task", "error");
      });
  }
}

// Open task modal
function openTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  currentEditingTaskId = taskId;

  // Populate modal
  modalTitle.textContent = task.title;
  modalDueDate.textContent = `Due: ${formatDate(task.dueDate)} | Code: ${
    task.taskCode
  }`;
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
  taskRecurrence.value = "none";
  taskProject.value = "";
  taskTags.value = "";

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
  taskRecurrence.value = task.recurrence || "none";
  taskProject.value = task.projectId || "";
  taskTags.value = task.tags ? task.tags.join(", ") : "";

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
function renderTasks(filterFunction = null) {
  // Clear lists
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";
  archiveList.innerHTML = "";

  // Sort tasks
  const sortedTasks = sortTasks(tasks);

  // Apply filter if provided
  const filteredTasks = filterFunction
    ? sortedTasks.filter(filterFunction)
    : sortedTasks;

  // Check if we have any tasks at all
  if (filteredTasks.length === 0) {
    if (!filterFunction) {
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
      archiveList.innerHTML = `
        <div class="empty-state">
          <i class="fas fa-archive"></i>
          <p>No archived tasks</p>
        </div>
      `;
    } else {
      const currentStatus =
        document.querySelector('.category[style=""]')?.dataset.status ||
        document.querySelector('.category:not([style*="none"])')?.dataset
          .status;

      if (currentStatus === "todo") {
        todoList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <p>No matching tasks in To-Do</p>
          </div>
        `;
      } else if (currentStatus === "in-progress") {
        inProgressList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <p>No matching tasks in Progress</p>
          </div>
        `;
      } else if (currentStatus === "done") {
        doneList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <p>No matching completed tasks</p>
          </div>
        `;
      } else if (currentStatus === "archive") {
        archiveList.innerHTML = `
          <div class="empty-state">
            <i class="fas fa-search"></i>
            <p>No matching archived tasks</p>
          </div>
        `;
      }
    }
    return;
  }

  // Count tasks for each category
  const todoTasks = filteredTasks.filter((t) => t.status === "todo");
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "in-progress"
  );
  const doneTasks = filteredTasks.filter((t) => t.status === "done");
  const archivedTasks = filteredTasks.filter((t) => t.status === "archived");

  // Render empty states if no tasks in a category
  if (todoTasks.length === 0 && !filterFunction) {
    todoList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <p>No tasks to do. Add a new task!</p>
      </div>
    `;
  }

  if (inProgressTasks.length === 0 && !filterFunction) {
    inProgressList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-spinner"></i>
        <p>No tasks in progress</p>
      </div>
    `;
  }

  if (doneTasks.length === 0 && !filterFunction) {
    doneList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-check-circle"></i>
        <p>No tasks completed yet</p>
      </div>
    `;
  }

  if (archivedTasks.length === 0 && !filterFunction) {
    archiveList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-archive"></i>
        <p>No archived tasks</p>
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
    } else if (task.status === "archived") {
      archiveList.appendChild(taskElement);
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

  // Update progress visualization
  updateProgressVisualization();
}

// Create task element
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-widget";
  taskElement.dataset.id = task.id;

  // Check if task is overdue or due soon
  const today = new Date();
  const dueDate = new Date(task.dueDate);
  const isOverdue =
    dueDate < today && task.status !== "done" && task.status !== "archived";
  const isDueSoon =
    !isOverdue &&
    dueDate < new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000) &&
    task.status !== "done" &&
    task.status !== "archived";

  // Create importance indicator
  let importanceDots = "";
  for (let i = 0; i < 3; i++) {
    importanceDots += `<div class="importance-dot"></div>`;
  }

  // Get project info if exists
  let projectBadge = "";
  if (task.projectId) {
    const project = projects.find((p) => p.id === task.projectId);
    if (project) {
      projectBadge = `<span class="project-tag" style="background-color: ${project.color}">${project.name}</span>`;
    }
  }

  // Create tags if exist
  let tagsHtml = "";
  if (task.tags && task.tags.length > 0) {
    tagsHtml = `<div class="task-tags">${task.tags
      .map((tag) => `<span class="task-tag">${tag}</span>`)
      .join("")}</div>`;
  }

  // Recurrence indicator
  let recurrenceIndicator = "";
  if (task.recurrence && task.recurrence !== "none") {
    recurrenceIndicator = `<i class="fas fa-repeat recurring-indicator" title="${task.recurrence} recurrence"></i>`;
  }

  taskElement.innerHTML = `
    <h3>${task.title} ${recurrenceIndicator}
      <span class="importance-label importance-${
        task.importance
      }-label">Level ${task.importance}</span>
      ${projectBadge}
    </h3>
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
    ${tagsHtml}
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
      ${
        task.status !== "archived"
          ? `<button class="btn-info archive-task"><i class="fas fa-archive"></i>Archive</button>`
          : ""
      }
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

  // Add archive listener if not already archived
  if (task.status !== "archived") {
    taskElement
      .querySelector(".archive-task")
      .addEventListener("click", (e) => {
        e.stopPropagation();
        archiveTask(task.id);
      });
  }

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

// Check for overdue tasks
function checkOverdueTasks() {
  const today = new Date();
  const overdueTasks = tasks.filter((task) => {
    const dueDate = new Date(task.dueDate);
    return (
      dueDate < today && task.status !== "done" && task.status !== "archived"
    );
  });

  if (overdueTasks.length > 0) {
    showNotification(
      `You have ${overdueTasks.length} overdue task(s)!`,
      "warning"
    );
  }
}

// Generate unique 10-digit task code
function generateTaskCode() {
  return Math.random().toString().substring(2, 12);
}

// Check for task reminders
function checkTaskReminders() {
  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  tasks.forEach((task) => {
    if (task.status !== "done" && task.status !== "archived") {
      const dueDate = new Date(task.dueDate);

      // Check if task is due in 2 days
      if (dueDate <= twoDaysFromNow && dueDate > now) {
        showNotification(
          `Reminder: Task "${task.title}" (Code: ${task.taskCode}) is due in 2 days!`,
          "warning"
        );
      }
    }
  });
}

// Schedule task reminder
function scheduleTaskReminder(task) {
  const dueDate = new Date(task.dueDate);
  const twoDaysBefore = new Date(dueDate.getTime() - 2 * 24 * 60 * 60 * 1000);
  const now = new Date();

  // If the reminder time is in the future, set a timeout
  if (twoDaysBefore > now) {
    const timeUntilReminder = twoDaysBefore.getTime() - now.getTime();

    setTimeout(() => {
      if (task.status !== "done" && task.status !== "archived") {
        showNotification(
          `Reminder: Task "${task.title}" (Code: ${task.taskCode}) is due in 2 days!`,
          "warning"
        );
      }
    }, timeUntilReminder);
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

// 1. Recurring Tasks
function toggleRecurrenceOptions() {
  const recurrence = taskRecurrence.value;
  const optionsDiv = document.getElementById("recurrence-options");

  if (optionsDiv) {
    if (recurrence !== "none") {
      optionsDiv.style.display = "block";
    } else {
      optionsDiv.style.display = "none";
    }
  }
}

function setupRecurringTask(task) {
  if (task.recurrence !== "none") {
    const nextDate = calculateNextRecurrence(task.dueDate, task.recurrence);
    const timeUntilNext = new Date(nextDate) - new Date();

    if (timeUntilNext > 0) {
      setTimeout(() => {
        createRecurringTaskInstance(task);
      }, timeUntilNext);
    }
  }
}

function calculateNextRecurrence(dueDate, recurrence) {
  const date = new Date(dueDate);

  switch (recurrence) {
    case "daily":
      date.setDate(date.getDate() + 1);
      break;
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
    case "yearly":
      date.setFullYear(date.getFullYear() + 1);
      break;
  }

  return date.toISOString().split("T")[0];
}

function createRecurringTaskInstance(originalTask) {
  const nextDueDate = calculateNextRecurrence(
    originalTask.dueDate,
    originalTask.recurrence
  );

  const newRecurringTask = {
    ...originalTask,
    id: Date.now().toString(),
    dueDate: nextDueDate,
    status: "todo",
    progress: 0,
    checkpoints: originalTask.checkpoints.map((c) => ({
      ...c,
      completed: false,
    })),
    isRecurringInstance: true,
    originalTaskId: originalTask.id,
  };

  delete newRecurringTask.recurrence; // Remove recurrence from instance

  tasks.push(newRecurringTask);
  saveTasks();
  renderTasks();
  updateStats();

  // Schedule next instance
  setupRecurringTask(originalTask);

  showNotification(
    `New instance of "${originalTask.title}" created!`,
    "success"
  );
}

// 2. Reminders & Notifications
function scheduleReminders(task) {
  if (!task.dueDate) return;

  const dueDate = new Date(task.dueDate);
  const reminderTimeMin = userSettings.reminderTime || 30; // minutes
  const reminderDate = new Date(dueDate.getTime() - reminderTimeMin * 60000);

  const timeUntilReminder = reminderDate - new Date();

  if (timeUntilReminder > 0) {
    setTimeout(() => {
      showReminderNotification(task);
    }, timeUntilReminder);
  }
}

function showReminderNotification(task) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(`SchedulePro Reminder: ${task.title}`, {
      body: `Your task "${task.title}" is due soon!`,
      icon: "/icon-192.png",
    });
  }

  // Fallback to toast notification
  showToastNotification(`Reminder: "${task.title}" is due soon!`);
}

function checkReminders() {
  tasks.forEach((task) => {
    if (task.status !== "done" && task.status !== "archived" && task.dueDate) {
      scheduleReminders(task);
    }
  });
}

// 3. Subtasks
function addSubtask(taskId, text) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  if (!task.subtasks) {
    task.subtasks = [];
  }

  task.subtasks.push({
    id: Date.now().toString(),
    text: text,
    completed: false,
  });

  saveTasks();
  renderTasks();
}

function toggleSubtask(taskId, subtaskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task || !task.subtasks) return;

  const subtask = task.subtasks.find((s) => s.id === subtaskId);
  if (subtask) {
    subtask.completed = !subtask.completed;

    // Update task progress
    const completedSubtasks = task.subtasks.filter((s) => s.completed).length;
    task.progress = Math.round(
      (completedSubtasks / task.subtasks.length) * 100
    );

    // Auto-update status based on progress
    if (task.progress === 100) {
      task.status = "done";
    } else if (task.progress > 0) {
      task.status = "in-progress";
    } else {
      task.status = "todo";
    }

    saveTasks();
    renderTasks();
    updateStats();
  }
}

// 4. Task Tags/Categories/Projects
function addProject(name, color) {
  const newProject = {
    id: Date.now().toString(),
    name,
    color,
  };

  projects.push(newProject);
  saveProjects();
  renderProjectFilter();
  renderProjectSelect();
  showToastNotification(`Project "${name}" added!`);
}

function addTag(name) {
  const newTag = {
    id: Date.now().toString(),
    name,
  };

  tags.push(newTag);
  saveTags();
  renderTagFilter();
  showToastNotification(`Tag "${name}" added!`);
}

function assignProjectToTask(taskId, projectId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.projectId = projectId;
    saveTasks();
    renderTasks();
  }
}

function assignTagToTask(taskId, tagId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    if (!task.tags) {
      task.tags = [];
    }

    if (!task.tags.includes(tagId)) {
      task.tags.push(tagId);
      saveTasks();
      renderTasks();
    }
  }
}

function renderProjectFilter() {
  projectFilter.innerHTML = '<option value="all">All Projects</option>';

  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    projectFilter.appendChild(option);
  });
}

function renderProjectSelect() {
  taskProject.innerHTML = '<option value="">No Project</option>';

  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    taskProject.appendChild(option);
  });
}

function renderTagFilter() {
  tagFilter.innerHTML = '<option value="all">All Tags</option>';

  tags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag.id;
    option.textContent = tag.name;
    tagFilter.appendChild(option);
  });
}

function filterByProject() {
  const projectId = projectFilter.value;
  renderTasks(
    projectId === "all" ? null : (task) => task.projectId === projectId
  );
}

function filterByTag() {
  const tagId = tagFilter.value;
  renderTasks(
    tagId === "all" ? null : (task) => task.tags && task.tags.includes(tagId)
  );
}

// 5. Calendar View
function openCalendarView() {
  calendarModalOverlay.classList.add("active");
  renderCalendar();
}

function closeCalendarView() {
  calendarModalOverlay.classList.remove("active");
}

function renderCalendar() {
  // Clear previous calendar
  calendarGrid.innerHTML = "";

  // Set month/year header
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  calendarMonthYear.textContent = `${
    monthNames[currentCalendarDate.getMonth()]
  } ${currentCalendarDate.getFullYear()}`;

  // Get first day of month and number of days
  const firstDay = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth(),
    1
  );
  const lastDay = new Date(
    currentCalendarDate.getFullYear(),
    currentCalendarDate.getMonth() + 1,
    0
  );
  const daysInMonth = lastDay.getDate();

  // Create day headers
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  for (let i = 0; i < 7; i++) {
    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-day-header";
    dayHeader.textContent = dayNames[i];
    calendarGrid.appendChild(dayHeader);
  }

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay.getDay(); i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  // Add cells for each day of the month
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= daysInMonth; i++) {
    const dayCell = document.createElement("div");
    const cellDate = new Date(
      currentCalendarDate.getFullYear(),
      currentCalendarDate.getMonth(),
      i
    );

    dayCell.className = "calendar-day";
    if (cellDate.getTime() === today.getTime()) {
      dayCell.classList.add("today");
    }

    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-day-header";
    dayHeader.textContent = i;
    dayCell.appendChild(dayHeader);

    // Add tasks for this day
    const dayTasks = tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getDate() === i &&
        taskDate.getMonth() === currentCalendarDate.getMonth() &&
        taskDate.getFullYear() === currentCalendarDate.getFullYear()
      );
    });

    dayTasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.className = `calendar-task difficulty-${task.difficulty}`;
      taskElement.textContent = task.title;
      taskElement.addEventListener("click", () => openTaskModal(task.id));
      dayCell.appendChild(taskElement);
    });

    calendarGrid.appendChild(dayCell);
  }
}

function showPreviousMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() - 1);
  renderCalendar();
}

function showNextMonth() {
  currentCalendarDate.setMonth(currentCalendarDate.getMonth() + 1);
  renderCalendar();
}

// 6. Priority auto-sorting/filtering
function filterByPriority(priority) {
  priorityFilterBtns.forEach((btn) => btn.classList.remove("active"));

  if (priority === "all") {
    renderTasks();
    document.querySelector('[data-priority="all"]').classList.add("active");
  } else {
    renderTasks((task) => {
      if (priority === "high") return task.importance === 3;
      if (priority === "medium") return task.importance === 2;
      if (priority === "low") return task.importance === 1;
      return true;
    });
    document
      .querySelector(`[data-priority="${priority}"]`)
      .classList.add("active");
  }
}

// 7. Search functionality
function searchTasks() {
  const searchTerm = searchInput.value.toLowerCase();

  if (searchTerm.trim() === "") {
    renderTasks();
  } else {
    renderTasks(
      (task) =>
        task.title.toLowerCase().includes(searchTerm) ||
        task.description.toLowerCase().includes(searchTerm) ||
        (task.tags &&
          task.tags.some((tag) => tag.toLowerCase().includes(searchTerm)))
    );
  }
}

function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 8. Progress tracking visualization
function updateProgressVisualization() {
  const todoTasks = tasks.filter((task) => task.status === "todo");
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress");
  const doneTasks = tasks.filter((task) => task.status === "done");

  const todoProgress =
    todoTasks.length > 0
      ? Math.round(
          todoTasks.reduce((sum, task) => sum + task.progress, 0) /
            todoTasks.length
        )
      : 0;

  const inProgressProgress =
    inProgressTasks.length > 0
      ? Math.round(
          inProgressTasks.reduce((sum, task) => sum + task.progress, 0) /
            inProgressTasks.length
        )
      : 0;

  const doneProgress =
    doneTasks.length > 0
      ? Math.round(
          doneTasks.reduce((sum, task) => sum + task.progress, 0) /
            doneTasks.length
        )
      : 100;

  // Update progress bars
  document.querySelectorAll(
    ".progress-visualization .progress-bar"
  )[0].style.width = `${todoProgress}%`;
  document.querySelectorAll(
    ".progress-visualization .progress-bar"
  )[1].style.width = `${inProgressProgress}%`;
  document.querySelectorAll(
    ".progress-visualization .progress-bar"
  )[2].style.width = `${doneProgress}%`;

  // Update progress text
  document.querySelectorAll(
    ".progress-visualization .progress-category span"
  )[0].textContent = `${todoProgress}%`;
  document.querySelectorAll(
    ".progress-visualization .progress-category span"
  )[1].textContent = `${inProgressProgress}%`;
  document.querySelectorAll(
    ".progress-visualization .progress-category span"
  )[2].textContent = `${doneProgress}%`;
}

// Add this function to handle unarchiving
function unarchiveTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.status = "todo"; // Or determine previous status if needed
    saveTasks();
    renderTasks();
    updateStats();
    showNotification("Task unarchived successfully!", "success");
  }
}

function calculateCategoryProgress(status) {
  const categoryTasks = tasks.filter((task) => task.status === status);
  if (categoryTasks.length === 0) return 0;

  const totalProgress = categoryTasks.reduce(
    (sum, task) => sum + task.progress,
    0
  );
  return Math.round(totalProgress / categoryTasks.length);
}

// 9. Archive old tasks
function archiveTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    task.status = "archived";
    saveTasks();
    renderTasks();
    updateStats();
    showNotification("Task archived successfully!", "success");
  }
}

function toggleArchive() {
  const archiveSection = document.querySelector('[data-status="archive"]');
  if (archiveSection.style.display === "none") {
    archiveSection.style.display = "block";
    renderTasks((task) => task.status === "archived", "archive-list");
  } else {
    archiveSection.style.display = "none";
  }
}

// 10. Export/Import tasks
function exportTasks() {
  const dataStr = JSON.stringify(tasks);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `schedulepro-tasks-${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

function importTasks(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedTasks = JSON.parse(e.target.result);

      if (Array.isArray(importedTasks)) {
        // Merge imported tasks with existing ones
        tasks = [...tasks, ...importedTasks];
        saveTasks();
        renderTasks();
        updateStats();
        showToastNotification("Tasks imported successfully!");
      } else {
        showToastNotification("Invalid file format", "error");
      }
    } catch (error) {
      showToastNotification("Error importing tasks", "error");
      console.error("Import error:", error);
    }
  };
  reader.readAsText(file);
}

// 11. Mobile-friendly improvements
function setupTouchEvents() {
  const taskWidgets = document.querySelectorAll(".task-widget");

  taskWidgets.forEach((widget) => {
    let startX, startY, distX, distY;
    const threshold = 50; // Minimum swipe distance

    widget.addEventListener("touchstart", function (e) {
      const touch = e.touches[0];
      startX = touch.clientX;
      startY = touch.clientY;
    });

    widget.addEventListener("touchmove", function (e) {
      if (!startX || !startY) return;

      const touch = e.touches[0];
      distX = touch.clientX - startX;
      distY = touch.clientY - startY;
    });

    widget.addEventListener("touchend", function (e) {
      if (!distX || !distY) return;

      if (Math.abs(distX) > Math.abs(distY) && Math.abs(distX) > threshold) {
        // Horizontal swipe
        if (distX > 0) {
          // Right swipe - mark as done
          const taskId = widget.dataset.id;
          const task = tasks.find((t) => t.id === taskId);
          if (task && task.status !== "done") {
            task.status = "done";
            task.progress = 100;
            saveTasks();
            renderTasks();
            updateStats();
          }
        } else {
          // Left swipe - delete
          const taskId = widget.dataset.id;
          if (confirm("Are you sure you want to delete this task?")) {
            tasks = tasks.filter((t) => t.id !== taskId);
            saveTasks();
            renderTasks();
            updateStats();
          }
        }
      }

      // Reset values
      startX = null;
      startY = null;
      distX = null;
      distY = null;
    });
  });
}

// 12. Improved checkpoints UX
function enhanceCheckpointsUX() {
  document.addEventListener("change", function (e) {
    if (e.target.matches('.checkpoint input[type="checkbox"]')) {
      const checkpoint = e.target.closest(".checkpoint");
      if (e.target.checked) {
        checkpoint.classList.add("completed");
      } else {
        checkpoint.classList.remove("completed");
      }

      // Auto-update task status when checkpoints are changed
      const taskId = checkpoint.closest(".task-modal").dataset.taskId;
      const task = tasks.find((t) => t.id === taskId);

      if (task && task.checkpoints) {
        const completed = task.checkpoints.filter((c) => c.completed).length;
        const total = task.checkpoints.length;

        if (completed === total && total > 0) {
          // All checkpoints completed - move to done
          task.status = "done";
          task.progress = 100;
        } else if (completed > 0) {
          // Some checkpoints completed - move to in-progress
          task.status = "in-progress";
          task.progress = Math.round((completed / total) * 100);
        } else {
          // No checkpoints completed - move to todo
          task.status = "todo";
          task.progress = 0;
        }

        saveTasks();
        renderTasks();
        updateStats();
      }
    }
  });
}

// 13. User settings
function loadUserSettings() {
  defaultSort.value = userSettings.defaultSort;
  defaultFilter.value = userSettings.defaultFilter;
  reminderTime.value = userSettings.reminderTime;
  displayName.value = userSettings.displayName || "";

  if (userSettings.profilePicture) {
    updateProfilePicture();
  }
}

function openSettings() {
  settingsModalOverlay.classList.add("active");
}

function closeSettings() {
  settingsModalOverlay.classList.remove("active");
}

function saveSettings() {
  userSettings.defaultSort = defaultSort.value;
  userSettings.defaultFilter = defaultFilter.value;
  userSettings.reminderTime = parseInt(reminderTime.value);
  userSettings.displayName = displayName.value;

  localStorage.setItem("schedulepro-settings", JSON.stringify(userSettings));
  closeSettings();
  showToastNotification("Settings saved successfully!");
}

function handleProfilePictureUpload(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    userSettings.profilePicture = e.target.result;
    localStorage.setItem("schedulepro-settings", JSON.stringify(userSettings));
    updateProfilePicture();
  };
  reader.readAsDataURL(file);
}

function updateProfilePicture() {
  if (userSettings.profilePicture) {
    const avatar = document.querySelector(".user-avatar");
    if (avatar) {
      avatar.style.backgroundImage = `url(${userSettings.profilePicture})`;
      avatar.style.backgroundSize = "cover";
      avatar.style.backgroundPosition = "center";
      avatar.innerHTML = "";
    }
  }
}

// 14. Gamification
function checkStreak() {
  const today = new Date().toISOString().split("T")[0];

  if (lastCompletedDate) {
    const lastDate = new Date(lastCompletedDate);
    const todayDate = new Date(today);
    const diffTime = Math.abs(todayDate - lastDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // Consecutive day
      completedStreak++;
    } else if (diffDays > 1) {
      // Broken streak
      completedStreak = 1;
    }
  } else {
    // First completion
    completedStreak = 1;
  }

  lastCompletedDate = today;
  localStorage.setItem("schedulepro-streak", completedStreak.toString());
  localStorage.setItem("schedulepro-last-completed", lastCompletedDate);

  // Award badges based on streak
  awardBadges();
}

function awardBadges() {
  const badges = [];

  if (completedStreak >= 3) badges.push("3-day streak");
  if (completedStreak >= 7) badges.push("7-day streak");
  if (completedStreak >= 30) badges.push("30-day streak");

  // Check for other achievements
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  if (completedTasks >= 10) badges.push("10 tasks completed");
  if (completedTasks >= 50) badges.push("50 tasks completed");
  if (completedTasks >= 100) badges.push("100 tasks completed");

  userSettings.badges = [
    ...new Set([...(userSettings.badges || []), ...badges]),
  ];
  localStorage.setItem("schedulepro-settings", JSON.stringify(userSettings));
}

// 15. Security & Profile Management
// (Handled through Firebase Auth functions above)

// 16. Data Visualization & Insights
function openInsights() {
  insightsModalOverlay.classList.add("active");
  renderInsights();
}

function closeInsights() {
  insightsModalOverlay.classList.remove("active");
}

function renderInsights() {
  // Calculate stats
  const weeklyCompleted = calculateWeeklyCompleted();
  const completionRate = calculateCompletionRate();
  const productiveDay = findMostProductiveDay();

  // Update DOM
  weeklyCompletedEl.textContent = weeklyCompleted;
  completionRateEl.textContent = `${completionRate}%`;
  currentStreakEl.textContent = `${completedStreak} days`;
  productiveDayEl.textContent = productiveDay;

  // Render chart
  renderProductivityChart();
}

function calculateWeeklyCompleted() {
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  return tasks.filter((task) => {
    if (task.status !== "done" || !task.completedDate) return false;
    const completedDate = new Date(task.completedDate);
    return completedDate >= oneWeekAgo;
  }).length;
}

function calculateCompletionRate() {
  if (tasks.length === 0) return 0;
  const completed = tasks.filter((t) => t.status === "done").length;
  return Math.round((completed / tasks.length) * 100);
}

function findMostProductiveDay() {
  const dayCount = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
    Saturday: 0,
  };

  tasks.forEach((task) => {
    if (task.status === "done" && task.completedDate) {
      const date = new Date(task.completedDate);
      const dayName = date.toLocaleDateString("en-US", { weekday: "long" });
      dayCount[dayName]++;
    }
  });

  let mostProductive = "None";
  let maxCount = 0;

  for (const day in dayCount) {
    if (dayCount[day] > maxCount) {
      mostProductive = day;
      maxCount = dayCount[day];
    }
  }

  return mostProductive;
}

function renderProductivityChart() {
  const ctx = document.getElementById("productivity-chart").getContext("2d");

  if (typeof Chart === "undefined") return;

  const last7Days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    last7Days.push(date.toISOString().split("T")[0]);
  }

  const dailyCompleted = last7Days.map((day) => {
    return tasks.filter(
      (task) => task.status === "done" && task.completedDate === day
    ).length;
  });

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: last7Days.map((day) =>
        new Date(day).toLocaleDateString("en-US", { weekday: "short" })
      ),
      datasets: [
        {
          label: "Tasks Completed",
          data: dailyCompleted,
          backgroundColor: "rgba(108, 92, 231, 0.7)",
          borderColor: "rgba(108, 92, 231, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1,
          },
        },
      },
    },
  });
}

// Project management
function openAddProjectModal() {
  projectModalOverlay.classList.add("active");
}

function closeAddProjectModal() {
  projectModalOverlay.classList.remove("active");
}

function saveProject() {
  const name = projectName.value.trim();
  const color = projectColor.value;

  if (!name) {
    showToastNotification("Project name is required", "error");
    return;
  }

  addProject(name, color);
  closeAddProjectModal();
  projectName.value = "";
  projectColor.value = "#6c5ce7";
}

// Utility functions
function showToastNotification(message, type = "success") {
  const toast = document.createElement("div");
  toast.className = `toast-notification ${type}`;
  toast.innerHTML = `
    <i class="fas fa-${
      type === "success"
        ? "check-circle"
        : type === "error"
        ? "exclamation-circle"
        : "info-circle"
    }"></i>
    <span>${message}</span>
  `;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add("show");
  }, 100);

  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

function saveProjects() {
  localStorage.setItem("schedulepro-projects", JSON.stringify(projects));
}

function saveTags() {
  localStorage.setItem("schedulepro-tags", JSON.stringify(tags));
}

// Initialize the app
init();
