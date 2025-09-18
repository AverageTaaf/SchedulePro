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

// Additional DOM Elements
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
let tasks = [];
let currentEditingTaskId = null;
let currentImportance = 1;
let darkMode = localStorage.getItem("schedulepro-darkmode") === "true";
let formCollapsed = false;
let currentUser = null;
let authModalMode = "login";

// User settings
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

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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

  // Remove any existing dropdown
  const existingDropdown = document.getElementById("user-dropdown");
  if (existingDropdown) {
    existingDropdown.remove();
  }

  // Create user dropdown
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

  // Toggle dropdown on user button click
  document
    .getElementById("user-menu-btn")
    .addEventListener("click", toggleUserDropdown);
}

// Toggle user dropdown
function toggleUserDropdown() {
  const dropdown = document.getElementById("user-dropdown");
  if (dropdown) {
    dropdown.classList.toggle("active");
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

// Toggle form visibility with animation
function toggleForm() {
  formCollapsed = !formCollapsed;
  if (formCollapsed) {
    formContent.style.maxHeight = "0";
    toggleFormBtn.innerHTML = '<i class="fas fa-plus"></i>Expand';
  } else {
    formContent.style.maxHeight = formContent.scrollHeight + "px";
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
  if (signupPassword) {
    signupPassword.addEventListener("input", validatePasswordRequirements);
  }
  if (signupConfirmPassword) {
    signupConfirmPassword.addEventListener("input", validatePasswordMatch);
  }

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
  if (searchInput)
    searchInput.addEventListener("input", debounce(searchTasks, 300));
  if (calendarViewBtn)
    calendarViewBtn.addEventListener("click", openCalendarView);
  if (closeCalendarModal)
    closeCalendarModal.addEventListener("click", closeCalendarView);
  if (prevMonthBtn) prevMonthBtn.addEventListener("click", showPreviousMonth);
  if (nextMonthBtn) nextMonthBtn.addEventListener("click", showNextMonth);
  if (exportBtn) exportBtn.addEventListener("click", exportTasks);
  if (importBtn) importBtn.addEventListener("click", () => importFile.click());
  if (importFile) importFile.addEventListener("change", importTasks);
  if (settingsBtn) settingsBtn.addEventListener("click", openSettings);
  if (closeSettingsModal)
    closeSettingsModal.addEventListener("click", closeSettings);
  if (saveSettingsBtn) saveSettingsBtn.addEventListener("click", saveSettings);
  if (profilePicture)
    profilePicture.addEventListener("change", handleProfilePictureUpload);
  if (insightsBtn) insightsBtn.addEventListener("click", openInsights);
  if (closeInsightsModal)
    closeInsightsModal.addEventListener("click", closeInsights);
  if (showArchiveBtn) showArchiveBtn.addEventListener("click", toggleArchive);
  if (projectFilter) projectFilter.addEventListener("change", filterByProject);
  if (tagFilter) tagFilter.addEventListener("change", filterByTag);
  if (taskRecurrence)
    taskRecurrence.addEventListener("change", toggleRecurrenceOptions);
  if (addProjectBtn)
    addProjectBtn.addEventListener("click", openAddProjectModal);
  if (closeProjectModal)
    closeProjectModal.addEventListener("click", closeAddProjectModal);
  if (saveProjectBtn) saveProjectBtn.addEventListener("click", saveProject);

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
  const reqLength = document.getElementById("req-length");
  const reqUpper = document.getElementById("req-upper");
  const reqLower = document.getElementById("req-lower");
  const reqNumber = document.getElementById("req-number");
  const reqSpecial = document.getElementById("req-special");

  if (reqLength)
    reqLength.className = validation.minLength ? "valid" : "invalid";
  if (reqUpper)
    reqUpper.className = validation.hasUpperCase ? "valid" : "invalid";
  if (reqLower)
    reqLower.className = validation.hasLowerCase ? "valid" : "invalid";
  if (reqNumber)
    reqNumber.className = validation.hasNumber ? "valid" : "invalid";
  if (reqSpecial)
    reqSpecial.className = validation.hasSpecialChar ? "valid" : "invalid";
}

function validatePasswordMatch() {
  const password = signupPassword.value;
  const confirmPassword = signupConfirmPassword.value;
  const matchIndicator = document.getElementById("req-match");

  if (matchIndicator) {
    if (confirmPassword.length === 0) {
      matchIndicator.className = "";
    } else if (password === confirmPassword) {
      matchIndicator.className = "valid";
    } else {
      matchIndicator.className = "invalid";
    }
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
      const taskId = document.querySelector(".dragging")?.dataset.id;
      if (!taskId) return;

      const newStatus = list.parentElement.dataset.status;

      // Update task status
      const taskIndex = tasks.findIndex((t) => t.id === taskId);
      if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        saveTaskToFirestore(tasks[taskIndex]);
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
    const completedTasks = tasks.filter((t) => t.status === "done");

    // Delete from Firebase if logged in
    if (currentUser) {
      completedTasks.forEach((task) => {
        db.collection("users")
          .doc(currentUser.uid)
          .collection("tasks")
          .doc(task.id)
          .delete()
          .catch((error) => {
            console.error("Error deleting task: ", error);
          });
      });
    }

    tasks = tasks.filter((t) => t.status !== "done");
    saveTasksToLocalStorage();
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
    if (!t.dueDate) return false;
    const dueDate = new Date(t.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && t.status !== "done";
  }).length;

  if (totalTasksEl) totalTasksEl.textContent = total;
  if (completedTasksEl) completedTasksEl.textContent = completed;
  if (inprogressTasksEl) inprogressTasksEl.textContent = inProgress;
  if (overdueTasksEl) overdueTasksEl.textContent = overdue;
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

// Task management functions
function loadUserTasks() {
  if (!currentUser) {
    // Load from localStorage if not logged in
    tasks = JSON.parse(localStorage.getItem("schedulepro-tasks")) || [];
    renderTasks();
    updateStats();
    return;
  }

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

function saveTasksToLocalStorage() {
  localStorage.setItem("schedulepro-tasks", JSON.stringify(tasks));
}

function saveTaskToFirestore(task) {
  if (!currentUser) {
    saveTasksToLocalStorage();
    return;
  }

  const taskData = { ...task };
  delete taskData.id; // Remove the id field before saving to Firestore

  db.collection("users")
    .doc(currentUser.uid)
    .collection("tasks")
    .doc(task.id)
    .set(taskData)
    .catch((error) => {
      console.error("Error saving task: ", error);
      showNotification("Error saving task", "error");
    });
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
    saveTasksToLocalStorage();
    renderTasks();
    resetForm();
    updateStats();
    showNotification("Task added successfully!", "success");
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

  if (!currentUser) {
    saveTasksToLocalStorage();
  } else {
    saveTaskToFirestore(tasks[taskIndex]);
  }

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
    saveTasksToLocalStorage();
  } else {
    saveTaskToFirestore(tasks[taskIndex]);
  }

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
    const taskIndex = tasks.findIndex((t) => t.id === currentEditingTaskId);
    if (taskIndex === -1) return;

    if (!currentUser) {
      // Delete from localStorage if not logged in
      tasks = tasks.filter((t) => t.id !== currentEditingTaskId);
      saveTasksToLocalStorage();
    } else {
      // Delete from Firestore
      db.collection("users")
        .doc(currentUser.uid)
        .collection("tasks")
        .doc(currentEditingTaskId)
        .delete()
        .catch((error) => {
          console.error("Error deleting task: ", error);
          showNotification("Error deleting task", "error");
        });

      tasks = tasks.filter((t) => t.id !== currentEditingTaskId);
    }

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

      if (completed === total) {
        task.status = "done";
      } else if (completed > 0) {
        task.status = "in-progress";
      } else {
        task.status = "todo";
      }

      // Update progress bar
      const progress = Math.round((completed / total) * 100);
      modalProgressBar.style.width = `${progress}%`;
      modalProgressText.textContent = `${progress}%`;
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
  taskDueDate.value = new Date().toISOString().split("T")[0];
  taskDifficulty.value = "medium";
  taskCheckpoints.value = "";
  taskRecurrence.value = "none";
  taskProject.value = "";
  taskTags.value = "";

  // Reset importance selection
  importanceOptions.forEach((option) => {
    option.classList.remove("selected");
  });
  importanceOptions[0].classList.add("selected");
  currentImportance = 1;
}

// Render tasks
function renderTasks() {
  // Clear lists
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";
  archiveList.innerHTML = "";

  // Sort tasks
  const sortBy = sortSelect.value;
  let sortedTasks = [...tasks];

  switch (sortBy) {
    case "date-added-desc":
      sortedTasks.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
      break;
    case "date-added-asc":
      sortedTasks.sort((a, b) => new Date(a.dateAdded) - new Date(b.dateAdded));
      break;
    case "due-date-asc":
      sortedTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
      break;
    case "due-date-desc":
      sortedTasks.sort((a, b) => new Date(b.dueDate) - new Date(a.dueDate));
      break;
    case "importance-desc":
      sortedTasks.sort((a, b) => b.importance - a.importance);
      break;
    case "importance-asc":
      sortedTasks.sort((a, b) => a.importance - b.importance);
      break;
    case "difficulty-desc":
      const difficultyOrder = { hard: 3, medium: 2, easy: 1 };
      sortedTasks.sort(
        (a, b) => difficultyOrder[b.difficulty] - difficultyOrder[a.difficulty]
      );
      break;
    case "difficulty-asc":
      const difficultyOrderAsc = { hard: 3, medium: 2, easy: 1 };
      sortedTasks.sort(
        (a, b) =>
          difficultyOrderAsc[a.difficulty] - difficultyOrderAsc[b.difficulty]
      );
      break;
  }

  // Render tasks
  sortedTasks.forEach((task) => {
    const taskWidget = createTaskWidget(task);

    if (task.status === "archived") {
      archiveList.appendChild(taskWidget);
    } else {
      switch (task.status) {
        case "todo":
          todoList.appendChild(taskWidget);
          break;
        case "in-progress":
          inProgressList.appendChild(taskWidget);
          break;
        case "done":
          doneList.appendChild(taskWidget);
          break;
      }
    }
  });

  // Update empty states
  updateEmptyStates();
}

// Create task widget
function createTaskWidget(task) {
  const taskWidget = document.createElement("div");
  taskWidget.className = "task-widget";
  taskWidget.dataset.id = task.id;
  taskWidget.draggable = true;

  // Add drag start event
  taskWidget.addEventListener("dragstart", () => {
    taskWidget.classList.add("dragging");
  });

  taskWidget.addEventListener("dragend", () => {
    taskWidget.classList.remove("dragging");
  });

  // Calculate days until due
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(task.dueDate);
  const daysUntilDue = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  // Determine urgency
  let urgencyClass = "";
  let urgencyText = "";
  if (task.status !== "done") {
    if (daysUntilDue < 0) {
      urgencyClass = "overdue";
      urgencyText = "Overdue";
    } else if (daysUntilDue === 0) {
      urgencyClass = "due-today";
      urgencyText = "Due today";
    } else if (daysUntilDue <= 2) {
      urgencyClass = "due-soon";
      urgencyText = "Due soon";
    }
  }

  // Format date
  const formattedDate = formatDate(task.dueDate);

  // Create task widget HTML
  taskWidget.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${task.title}</h3>
      <span class="task-code">${task.taskCode}</span>
    </div>
    <div class="task-details">
      <div class="task-meta">
        <span class="due-date ${urgencyClass}">
          <i class="fas fa-calendar-alt"></i>
          ${formattedDate}
          ${urgencyText ? `<span class="urgency">${urgencyText}</span>` : ""}
        </span>
        <span class="difficulty difficulty-${task.difficulty}">
          ${task.difficulty.charAt(0).toUpperCase() + task.difficulty.slice(1)}
        </span>
        <span class="importance-label importance-${task.importance}-label">
          Level ${task.importance}
        </span>
      </div>
      <div class="task-progress">
        <div class="progress-bar">
          <div class="progress" style="width: ${task.progress}%"></div>
        </div>
        <span class="progress-text">${task.progress}%</span>
      </div>
      <div class="task-actions">
        <button class="btn-icon edit-task" title="Edit task">
          <i class="fas fa-edit"></i>
        </button>
        <button class="btn-icon archive-task" title="Archive task">
          <i class="fas fa-archive"></i>
        </button>
      </div>
    </div>
  `;

  // Add event listeners
  taskWidget
    .querySelector(".edit-task")
    .addEventListener("click", () => openTaskModal(task.id));

  taskWidget
    .querySelector(".archive-task")
    .addEventListener("click", () => archiveTask(task.id));

  return taskWidget;
}

// Archive task
function archiveTask(taskId) {
  const taskIndex = tasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) return;

  tasks[taskIndex].status = "archived";

  if (!currentUser) {
    saveTasksToLocalStorage();
  } else {
    saveTaskToFirestore(tasks[taskIndex]);
  }

  renderTasks();
  updateStats();
  showNotification("Task archived successfully!", "success");
}

// Toggle archive visibility
function toggleArchive() {
  const archiveSection = document.getElementById("archive-section");
  const isHidden = archiveSection.classList.contains("hidden");

  if (isHidden) {
    archiveSection.classList.remove("hidden");
    showArchiveBtn.innerHTML = '<i class="fas fa-eye-slash"></i>Hide Archive';
  } else {
    archiveSection.classList.add("hidden");
    showArchiveBtn.innerHTML = '<i class="fas fa-eye"></i>Show Archive';
  }
}

// Update empty states
function updateEmptyStates() {
  const emptyStates = document.querySelectorAll(".empty-state");
  emptyStates.forEach((state) => {
    const listId = state.closest(".task-column").querySelector(".task-list").id;
    const tasksInList = tasks.filter((task) => {
      if (listId === "todo-list") return task.status === "todo";
      if (listId === "in-progress-list") return task.status === "in-progress";
      if (listId === "done-list") return task.status === "done";
      if (listId === "archive-list") return task.status === "archived";
      return false;
    });

    if (tasksInList.length === 0) {
      state.style.display = "flex";
    } else {
      state.style.display = "none";
    }
  });
}

// Show notification
function showNotification(message, type) {
  notificationMessage.textContent = message;
  notification.className = `notification ${type}`;
  notificationIcon.className = `fas ${
    type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
  }`;

  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);
}

// Format date
function formatDate(dateString) {
  if (!dateString) return "No due date";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// Generate task code
function generateTaskCode() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  let code = "";

  // Add 3 random letters
  for (let i = 0; i < 3; i++) {
    code += letters.charAt(Math.floor(Math.random() * letters.length));
  }

  // Add hyphen
  code += "-";

  // Add 3 random numbers
  for (let i = 0; i < 3; i++) {
    code += numbers.charAt(Math.floor(Math.random() * numbers.length));
  }

  return code;
}

// Check for overdue tasks
function checkOverdueTasks() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    if (!task.dueDate || task.status === "done") return;

    const dueDate = new Date(task.dueDate);
    if (dueDate < today) {
      // Show notification for overdue tasks
      showNotification(`Task "${task.title}" is overdue!`, "error");
    }
  });
}

// Check for reminders
function checkReminders() {
  // Check if browser supports notifications
  if (!("Notification" in window)) return;

  // Check if notifications are allowed
  if (Notification.permission !== "granted") return;

  const now = new Date();
  const reminderTime = userSettings.reminderTime || 30; // minutes

  tasks.forEach((task) => {
    if (!task.dueDate || task.status === "done") return;

    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const minutesDiff = Math.floor(timeDiff / (1000 * 60));

    // Show notification if task is due within the reminder time
    if (minutesDiff <= reminderTime && minutesDiff >= 0) {
      new Notification(`Task Due Soon: ${task.title}`, {
        body: `Your task "${task.title}" is due in ${minutesDiff} minutes.`,
        icon: "/favicon.ico",
      });
    }
  });
}

// Check streak
function checkStreak() {
  const today = new Date().toDateString();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  // If we already completed a task today, don't update streak
  if (lastCompletedDate === today) return;

  // Check if we completed a task yesterday
  if (lastCompletedDate === yesterdayStr) {
    // Continue streak
    completedStreak++;
  } else {
    // Reset streak
    completedStreak = 1;
  }

  lastCompletedDate = today;
  localStorage.setItem("schedulepro-streak", completedStreak);
  localStorage.setItem("schedulepro-last-completed", lastCompletedDate);
}

// User settings functions
function loadUserSettings() {
  if (defaultSort)
    defaultSort.value = userSettings.defaultSort || "date-added-desc";
  if (defaultFilter) defaultFilter.value = userSettings.defaultFilter || "all";
  if (reminderTime) reminderTime.value = userSettings.reminderTime || 30;
  if (displayName) displayName.value = userSettings.displayName || "";

  // Load profile picture if exists
  if (userSettings.profilePicture && profilePicture) {
    profilePicture.style.backgroundImage = `url(${userSettings.profilePicture})`;
    profilePicture.innerHTML = "";
  } else if (profilePicture) {
    const initials = userSettings.displayName
      ? userSettings.displayName
          .split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
      : "U";
    profilePicture.innerHTML = initials;
  }
}

function saveSettings() {
  userSettings.defaultSort = defaultSort.value;
  userSettings.defaultFilter = defaultFilter.value;
  userSettings.reminderTime = parseInt(reminderTime.value);
  userSettings.displayName = displayName.value;

  localStorage.setItem("schedulepro-settings", JSON.stringify(userSettings));
  closeSettings();
  showNotification("Settings saved successfully!", "success");
}

function handleProfilePictureUpload(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    userSettings.profilePicture = e.target.result;
    localStorage.setItem("schedulepro-settings", JSON.stringify(userSettings));
    profilePicture.style.backgroundImage = `url(${e.target.result})`;
    profilePicture.innerHTML = "";
  };
  reader.readAsDataURL(file);
}

function openSettings() {
  loadUserSettings();
  settingsModalOverlay.classList.add("active");
}

function closeSettings() {
  settingsModalOverlay.classList.remove("active");
}

// Insights functions
function openInsights() {
  calculateInsights();
  insightsModalOverlay.classList.add("active");
}

function closeInsights() {
  insightsModalOverlay.classList.remove("active");
}

function calculateInsights() {
  // Weekly completed tasks
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyCompleted = tasks.filter(
    (t) => t.status === "done" && new Date(t.dateAdded) >= oneWeekAgo
  ).length;

  // Completion rate
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.status === "done").length;
  const completionRate =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Productive day (most tasks completed)
  const completedByDay = {};
  tasks
    .filter((t) => t.status === "done")
    .forEach((task) => {
      const day = new Date(task.dateAdded).getDay();
      completedByDay[day] = (completedByDay[day] || 0) + 1;
    });

  let productiveDay = "No data";
  let maxCompleted = 0;
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  for (let day in completedByDay) {
    if (completedByDay[day] > maxCompleted) {
      maxCompleted = completedByDay[day];
      productiveDay = days[day];
    }
  }

  // Update insights UI
  if (weeklyCompletedEl) weeklyCompletedEl.textContent = weeklyCompleted;
  if (completionRateEl) completionRateEl.textContent = `${completionRate}%`;
  if (currentStreakEl) currentStreakEl.textContent = completedStreak;
  if (productiveDayEl) productiveDayEl.textContent = productiveDay;

  // Draw simple productivity chart
  drawProductivityChart();
}

function drawProductivityChart() {
  if (!productivityChart) return;

  // Clear previous chart
  productivityChart.innerHTML = "";

  // Get last 7 days
  const days = [];
  const completedData = [];
  const createdData = [];

  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayName = date.toLocaleDateString("en-US", { weekday: "short" });
    days.push(dayName);

    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    // Count completed tasks for this day
    const completed = tasks.filter(
      (t) =>
        t.status === "done" &&
        new Date(t.dateAdded) >= dayStart &&
        new Date(t.dateAdded) <= dayEnd
    ).length;

    // Count created tasks for this day
    const created = tasks.filter(
      (t) =>
        new Date(t.dateAdded) >= dayStart && new Date(t.dateAdded) <= dayEnd
    ).length;

    completedData.push(completed);
    createdData.push(created);
  }

  // Find max value for scaling
  const maxValue = Math.max(
    Math.max(...completedData),
    Math.max(...createdData),
    1
  );

  // Draw chart
  const chartHeight = 150;
  const barWidth = 30;
  const spacing = 10;
  const totalWidth = days.length * (barWidth * 2 + spacing);
  productivityChart.style.width = `${totalWidth}px`;

  days.forEach((day, index) => {
    // Completed tasks bar
    const completedBar = document.createElement("div");
    completedBar.className = "chart-bar completed";
    completedBar.style.height = `${
      (completedData[index] / maxValue) * chartHeight
    }px`;
    completedBar.style.width = `${barWidth}px`;
    completedBar.style.left = `${index * (barWidth * 2 + spacing)}px`;
    completedBar.title = `Completed: ${completedData[index]}`;
    productivityChart.appendChild(completedBar);

    // Created tasks bar
    const createdBar = document.createElement("div");
    createdBar.className = "chart-bar created";
    createdBar.style.height = `${
      (createdData[index] / maxValue) * chartHeight
    }px`;
    createdBar.style.width = `${barWidth}px`;
    createdBar.style.left = `${index * (barWidth * 2 + spacing) + barWidth}px`;
    createdBar.title = `Created: ${createdData[index]}`;
    productivityChart.appendChild(createdBar);

    // Day label
    const dayLabel = document.createElement("div");
    dayLabel.className = "chart-label";
    dayLabel.textContent = day;
    dayLabel.style.left = `${
      index * (barWidth * 2 + spacing) + barWidth - 5
    }px`;
    productivityChart.appendChild(dayLabel);
  });
}

// Project management functions
function renderProjectFilter() {
  if (!projectFilter) return;

  projectFilter.innerHTML = '<option value="">All Projects</option>';
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    projectFilter.appendChild(option);
  });
}

function renderTagFilter() {
  if (!tagFilter) return;

  tagFilter.innerHTML = '<option value="">All Tags</option>';
  const uniqueTags = [...new Set(tasks.flatMap((task) => task.tags || []))];
  uniqueTags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag;
    option.textContent = tag;
    tagFilter.appendChild(option);
  });
}

function renderProjectSelect() {
  if (!taskProject) return;

  taskProject.innerHTML = '<option value="">No Project</option>';
  projects.forEach((project) => {
    const option = document.createElement("option");
    option.value = project.id;
    option.textContent = project.name;
    taskProject.appendChild(option);
  });
}

function filterByProject() {
  const projectId = projectFilter.value;
  const taskWidgets = document.querySelectorAll(".task-widget");

  taskWidgets.forEach((widget) => {
    const taskId = widget.dataset.id;
    const task = tasks.find((t) => t.id === taskId);

    if (!projectId || task.projectId === projectId) {
      widget.style.display = "flex";
    } else {
      widget.style.display = "none";
    }
  });
}

function filterByTag() {
  const tag = tagFilter.value;
  const taskWidgets = document.querySelectorAll(".task-widget");

  taskWidgets.forEach((widget) => {
    const taskId = widget.dataset.id;
    const task = tasks.find((t) => t.id === taskId);

    if (!tag || (task.tags && task.tags.includes(tag))) {
      widget.style.display = "flex";
    } else {
      widget.style.display = "none";
    }
  });
}

function filterByPriority(priority) {
  const taskWidgets = document.querySelectorAll(".task-widget");

  taskWidgets.forEach((widget) => {
    const taskId = widget.dataset.id;
    const task = tasks.find((t) => t.id === taskId);

    if (priority === "all" || task.importance.toString() === priority) {
      widget.style.display = "flex";
    } else {
      widget.style.display = "none";
    }
  });
}

function openAddProjectModal() {
  projectModalOverlay.classList.add("active");
}

function closeAddProjectModal() {
  projectModalOverlay.classList.remove("active");
  projectName.value = "";
  projectColor.value = "#3b82f6";
}

function saveProject() {
  const name = projectName.value.trim();
  const color = projectColor.value;

  if (!name) {
    showNotification("Project name is required", "error");
    return;
  }

  const newProject = {
    id: Date.now().toString(),
    name: name,
    color: color,
  };

  projects.push(newProject);
  localStorage.setItem("schedulepro-projects", JSON.stringify(projects));

  renderProjectFilter();
  renderProjectSelect();
  closeAddProjectModal();
  showNotification("Project created successfully!", "success");
}

// Calendar view functions
function openCalendarView() {
  renderCalendar();
  calendarModalOverlay.classList.add("active");
}

function closeCalendarView() {
  calendarModalOverlay.classList.remove("active");
}

function renderCalendar() {
  if (!calendarGrid || !calendarMonthYear) return;

  const year = currentCalendarDate.getFullYear();
  const month = currentCalendarDate.getMonth();

  // Set month and year header
  calendarMonthYear.textContent = `${currentCalendarDate.toLocaleDateString(
    "en-US",
    {
      month: "long",
    }
  )} ${year}`;

  // Clear previous calendar
  calendarGrid.innerHTML = "";

  // Get first day of month and total days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create day headers
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-day-header";
    dayHeader.textContent = day;
    calendarGrid.appendChild(dayHeader);
  });

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.className = "calendar-day empty";
    calendarGrid.appendChild(emptyCell);
  }

  // Add cells for each day of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.className = "calendar-day";

    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;

    // Check if this day has tasks
    const dayTasks = tasks.filter((task) => task.dueDate === dateStr);
    const completedTasks = dayTasks.filter((task) => task.status === "done");
    const overdueTasks = dayTasks.filter(
      (task) => task.status !== "done" && new Date(task.dueDate) < new Date()
    );

    dayCell.innerHTML = `
      <div class="calendar-day-number">${day}</div>
      ${
        dayTasks.length > 0
          ? `
        <div class="calendar-day-tasks">
          ${
            completedTasks.length > 0
              ? `<span class="completed-indicator">${completedTasks.length}</span>`
              : ""
          }
          ${
            overdueTasks.length > 0
              ? `<span class="overdue-indicator">${overdueTasks.length}</span>`
              : ""
          }
          ${
            dayTasks.length - completedTasks.length - overdueTasks.length > 0
              ? `<span class="pending-indicator">${
                  dayTasks.length - completedTasks.length - overdueTasks.length
                }</span>`
              : ""
          }
        </div>
      `
          : ""
      }
    `;

    // Add click event to view tasks for this day
    dayCell.addEventListener("click", () => {
      viewDayTasks(dateStr, dayTasks);
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

function viewDayTasks(dateStr, dayTasks) {
  // Create a modal to display tasks for the selected day
  const dayTasksModal = document.createElement("div");
  dayTasksModal.className = "modal-overlay active";
  dayTasksModal.innerHTML = `
    <div class="modal-content">
      <div class="modal-header">
        <h2>Tasks for ${formatDate(dateStr)}</h2>
        <button class="close-modal">&times;</button>
      </div>
      <div class="modal-body">
        ${
          dayTasks.length === 0
            ? `<p class="empty-state">No tasks for this day</p>`
            : `<ul class="day-tasks-list">
            ${dayTasks
              .map(
                (task) => `
              <li class="day-task-item ${task.status}">
                <h3>${task.title}</h3>
                <p>Status: ${task.status}</p>
                <p>Importance: Level ${task.importance}</p>
              </li>
            `
              )
              .join("")}
          </ul>`
        }
      </div>
    </div>
  `;

  document.body.appendChild(dayTasksModal);

  // Add event listener to close modal
  dayTasksModal.querySelector(".close-modal").addEventListener("click", () => {
    dayTasksModal.remove();
  });

  // Close modal when clicking outside
  dayTasksModal.addEventListener("click", (e) => {
    if (e.target === dayTasksModal) {
      dayTasksModal.remove();
    }
  });
}

// Export/Import functions
function exportTasks() {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(
    dataStr
  )}`;

  const exportFileDefaultName = `schedulepro-tasks-${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
}

function importTasks(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedTasks = JSON.parse(e.target.result);

      if (!Array.isArray(importedTasks)) {
        throw new Error("Invalid file format");
      }

      // Validate tasks structure
      const validTasks = importedTasks.filter(
        (task) => task.title && task.dueDate && task.status
      );

      if (validTasks.length === 0) {
        throw new Error("No valid tasks found in file");
      }

      // Add imported tasks
      tasks = [...tasks, ...validTasks];

      if (!currentUser) {
        saveTasksToLocalStorage();
      } else {
        // Save each task to Firestore
        validTasks.forEach((task) => {
          const taskData = { ...task };
          delete taskData.id;

          db.collection("users")
            .doc(currentUser.uid)
            .collection("tasks")
            .add(taskData)
            .catch((error) => {
              console.error("Error importing task: ", error);
            });
        });
      }

      renderTasks();
      updateStats();
      showNotification(
        `Successfully imported ${validTasks.length} tasks`,
        "success"
      );
    } catch (error) {
      console.error("Error importing tasks:", error);
      showNotification("Error importing tasks: " + error.message, "error");
    }
  };
  reader.readAsText(file);

  // Reset file input
  e.target.value = "";
}

// Toggle recurrence options
function toggleRecurrenceOptions() {
  const recurrenceOptions = document.getElementById("recurrence-options");
  if (!recurrenceOptions) return;

  if (taskRecurrence.value === "none") {
    recurrenceOptions.style.display = "none";
  } else {
    recurrenceOptions.style.display = "block";
  }
}

// Update progress visualization
function updateProgressVisualization() {
  const progressBars = document.querySelectorAll(".progress");
  progressBars.forEach((bar) => {
    const width = bar.style.width;
    if (width === "100%") {
      bar.classList.add("completed");
    } else {
      bar.classList.remove("completed");
    }
  });
}

// Debounce function for search
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

// Search tasks
function searchTasks() {
  const searchTerm = searchInput.value.toLowerCase();
  const taskWidgets = document.querySelectorAll(".task-widget");

  taskWidgets.forEach((widget) => {
    const taskId = widget.dataset.id;
    const task = tasks.find((t) => t.id === taskId);
    const matchesSearch =
      task.title.toLowerCase().includes(searchTerm) ||
      (task.description &&
        task.description.toLowerCase().includes(searchTerm)) ||
      (task.tags &&
        task.tags.some((tag) => tag.toLowerCase().includes(searchTerm))) ||
      task.taskCode.toLowerCase().includes(searchTerm);

    widget.style.display = matchesSearch ? "flex" : "none";
  });
}

// Check task reminders
function checkTaskReminders() {
  // Check if browser supports notifications
  if (!("Notification" in window)) return;

  // Check if notifications are allowed
  if (Notification.permission !== "granted") return;

  const now = new Date();

  tasks.forEach((task) => {
    if (!task.dueDate || task.status === "done") return;

    const dueDate = new Date(task.dueDate);
    const timeDiff = dueDate.getTime() - now.getTime();
    const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));

    // Show notification if task is due within 24 hours
    if (hoursDiff <= 24 && hoursDiff >= 0) {
      new Notification(`Task Due Soon: ${task.title}`, {
        body: `Your task "${task.title}" is due in ${hoursDiff} hours.`,
        icon: "/favicon.ico",
      });
    }
  });
}

// Initialize the application
document.addEventListener("DOMContentLoaded", init);
