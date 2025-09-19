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
const modalTaskTitle = document.getElementById("modal-task-title");
const modalTaskDescription = document.getElementById("modal-task-description");
const modalTaskDueDate = document.getElementById("modal-task-due-date");
const modalTaskDifficulty = document.getElementById("modal-task-difficulty");
const modalCheckpoints = document.getElementById("modal-checkpoints");
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
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const signupUsername = document.getElementById("signup-username");
const signupEmail = document.getElementById("signup-email");
const signupPassword = document.getElementById("signup-password");
const signupConfirmPassword = document.getElementById(
  "signup-confirm-password"
);
const googleLoginBtn = document.getElementById("google-login");
const googleRegisterBtn = document.getElementById("google-register");
const exportBtn = document.getElementById("export-btn");
const importBtn = document.getElementById("import-btn");
const importFile = document.getElementById("import-file");
const searchInput = document.getElementById("search-input");

const todoList = document.getElementById("todo-list");
const inProgressList = document.getElementById("in-progress-list");
const doneList = document.getElementById("done-list");

// State
let tasks = JSON.parse(localStorage.getItem("schedulepro-tasks")) || [];
let currentEditingTaskId = null;
let currentImportance = 1;
let darkMode = localStorage.getItem("schedulepro-darkmode") === "true";
let formCollapsed = false;
let currentUser = null;
let authModalMode = "login";
let currentFilter = "all";
let currentSearch = "";

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
      <p>Hello, ${displayName}</p>
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
  googleLoginBtn.addEventListener("click", signInWithGoogle);
  googleRegisterBtn.addEventListener("click", signInWithGoogle);
  exportBtn.addEventListener("click", exportTasks);
  importBtn.addEventListener("click", () => importFile.click());
  importFile.addEventListener("change", importTasks);

  // Search functionality
  searchInput.addEventListener("input", (e) => {
    currentSearch = e.target.value.toLowerCase();
    renderTasks();
  });

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

  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target === taskModalOverlay) closeTaskModal();
    if (e.target === helpModalOverlay) closeHelpModalWindow();
    if (e.target === authModalOverlay) closeAuthModalWindow();
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
  } else {
    authModalTitle.textContent = "Create an Account";
    signupForm.classList.remove("active");
    loginForm.classList.remove("active");
    signupForm.classList.add("active");
  }
}

function clearAuthForms() {
  loginForm.reset();
  signupForm.reset();
  const authStatus = document.querySelector(".auth-status");
  if (authStatus) {
    authStatus.style.display = "none";
    authStatus.className = "auth-status";
  }
}

function showAuthMessage(message, type) {
  const authStatus = document.querySelector(".auth-status");
  if (authStatus) {
    authStatus.textContent = message;
    authStatus.className = `auth-status ${type}`;
    authStatus.style.display = "block";
  }
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

// Google Sign-In
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth
    .signInWithPopup(provider)
    .then((result) => {
      showNotification("Signed in with Google successfully!", "success");
      closeAuthModalWindow();
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
      showAuthMessage("Failed to sign in with Google", "error");
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
    showNotification("Logged out successfully", "success");
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

  // Add drag events to tasks
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
  currentFilter = filter;
  renderTasks();

  // Update active button state
  document.querySelectorAll(".quick-actions button").forEach((btn) => {
    btn.classList.remove("active");
  });
  event.target.classList.add("active");
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
      scheduleTaskReminder(newTask);
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
  tasks[taskIndex].difficulty = modalTaskDifficulty.value;

  // Update importance
  const selectedImportance = document.querySelector(
    ".importance-option.selected"
  );
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
  modalTaskTitle.value = task.title;
  modalTaskDescription.value = task.description;
  modalTaskDueDate.value = task.dueDate;
  modalTaskDifficulty.value = task.difficulty;

  // Set importance
  const importanceOptions = document.querySelectorAll(".importance-option");
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
  // Filter tasks based on current search
  let filteredTasks = tasks;
  if (currentSearch) {
    filteredTasks = tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(currentSearch) ||
        task.description.toLowerCase().includes(currentSearch) ||
        task.taskCode.includes(currentSearch)
    );
  }

  // Apply current filter
  if (currentFilter === "active") {
    filteredTasks = filteredTasks.filter((t) => t.status !== "done");
  } else if (currentFilter === "completed") {
    filteredTasks = filteredTasks.filter((t) => t.status === "done");
  }

  // Sort tasks
  const sortedTasks = sortTasks(filteredTasks);

  // Clear lists
  todoList.innerHTML = "";
  inProgressList.innerHTML = "";
  doneList.innerHTML = "";

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
                <div class="task-code">Task Code: ${task.taskCode}</div>
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

// Generate unique 10-digit task code
function generateTaskCode() {
  return Math.random().toString().substring(2, 12);
}

// Check for task reminders
function checkTaskReminders() {
  const now = new Date();
  const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

  tasks.forEach((task) => {
    if (task.status !== "done") {
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
      if (task.status !== "done") {
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
      const importedData = JSON.parse(e.target.result);

      // Check if it's the right format
      if (Array.isArray(importedData)) {
        tasks = importedData;
        saveTasks();
        renderTasks();
        updateStats();
        showNotification("Tasks imported successfully!", "success");
      } else if (Array.isArray(importedData.tasks)) {
        tasks = importedData.tasks;
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

// Initialize the app
init();
