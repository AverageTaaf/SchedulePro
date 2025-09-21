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
  console.log("Firebase initialized successfully");
} catch (error) {
  console.error("Firebase initialization error:", error);
}

// Initialize Firestore
const db = firebase.firestore();

// Initialize Firebase Auth
const auth = firebase.auth();

// Global variables
let tasks = [];
let currentEditingTaskId = null;
let currentUser = null;
let currentView = "kanban";
let currentMonth = new Date().getMonth();
let currentYear = new Date().getFullYear();
let currentFilter = "all";
let currentTagFilter = "all";
let currentSort = "date-added-desc";
let searchQuery = "";

// DOM Elements
const elements = {
  // Forms
  taskForm: document.querySelector(".task-form"),
  taskTitle: document.getElementById("task-title"),
  taskDescription: document.getElementById("task-description"),
  taskDueDate: document.getElementById("task-due-date"),
  taskStartTime: document.getElementById("task-start-time"),
  taskEndTime: document.getElementById("task-end-time"),
  taskRecurrence: document.getElementById("task-recurrence"),
  taskDifficulty: document.getElementById("task-difficulty"),
  taskCheckpoints: document.getElementById("task-checkpoints"),
  taskTags: document.getElementById("task-tags"),
  taskReminder: document.getElementById("task-reminder"),

  // Buttons
  addTaskBtn: document.getElementById("add-task"),
  saveTaskBtn: document.getElementById("save-task"),
  toggleFormBtn: document.getElementById("toggle-form"),
  modeToggle: document.getElementById("mode-toggle"),
  viewToggle: document.getElementById("view-toggle"),
  helpBtn: document.getElementById("help-btn"),
  authBtn: document.getElementById("auth-btn"),
  settingsBtn: document.getElementById("settings-btn"),
  exportBtn: document.getElementById("export-btn"),
  importBtn: document.getElementById("import-btn"),
  importFile: document.getElementById("import-file"),
  archiveCompletedBtn: document.getElementById("archive-completed"),
  showArchivedBtn: document.getElementById("show-archived"),
  showAllBtn: document.getElementById("show-all"),
  showActiveBtn: document.getElementById("show-active"),
  showCompletedBtn: document.getElementById("show-completed"),
  clearCompletedBtn: document.getElementById("clear-completed"),

  // Modals
  taskModal: document.getElementById("task-modal-overlay"),
  helpModal: document.getElementById("help-modal-overlay"),
  authModal: document.getElementById("auth-modal-overlay"),
  settingsModal: document.getElementById("settings-modal-overlay"),
  archiveModal: document.getElementById("archive-modal-overlay"),
  profileModal: document.getElementById("profile-modal-overlay"),

  // Modal buttons
  closeModalBtns: document.querySelectorAll(".close-modal"),
  closeHelpModal: document.getElementById("close-help-modal"),
  closeAuthModal: document.getElementById("close-auth-modal"),
  closeSettingsModal: document.getElementById("close-settings-modal"),
  closeArchiveModal: document.getElementById("close-archive-modal"),
  closeProfileModal: document.getElementById("close-profile-modal"),
  saveChangesBtn: document.getElementById("save-changes"),
  deleteTaskBtn: document.getElementById("delete-task"),
  archiveTaskBtn: document.getElementById("archive-task"),

  // Modal form elements
  modalTaskTitle: document.getElementById("modal-task-title"),
  modalTaskDescription: document.getElementById("modal-task-description"),
  modalTaskDueDate: document.getElementById("modal-task-due-date"),
  modalTaskRecurrence: document.getElementById("modal-task-recurrence"),
  modalTaskDifficulty: document.getElementById("modal-task-difficulty"),
  modalTaskStartTime: document.getElementById("modal-task-start-time"),
  modalTaskEndTime: document.getElementById("modal-task-end-time"),
  modalTaskTags: document.getElementById("modal-task-tags"),
  modalTaskReminder: document.getElementById("modal-task-reminder"),
  modalCheckpoints: document.getElementById("modal-checkpoints"),

  // Auth elements
  loginForm: document.getElementById("login-form"),
  signupForm: document.getElementById("signup-form"),
  loginEmail: document.getElementById("login-email"),
  loginPassword: document.getElementById("login-password"),
  signupUsername: document.getElementById("signup-username"),
  signupEmail: document.getElementById("signup-email"),
  signupPassword: document.getElementById("signup-password"),
  signupConfirmPassword: document.getElementById("signup-confirm-password"),
  loginBtn: document.getElementById("login-btn"),
  registerBtn: document.getElementById("register-btn"),
  googleLogin: document.getElementById("google-login"),
  googleRegister: document.getElementById("google-register"),
  switchToSignup: document.getElementById("switch-to-signup"),
  switchToLogin: document.getElementById("switch-to-login"),
  loginStatus: document.getElementById("login-status"),
  registerStatus: document.getElementById("register-status"),

  // Settings elements
  defaultTheme: document.getElementById("default-theme"),
  defaultView: document.getElementById("default-view"),
  reduceMotion: document.getElementById("reduce-motion"),
  disableAnimations: document.getElementById("disable-animations"),
  saveSettingsBtn: document.getElementById("save-settings"),

  // Profile elements
  profileName: document.getElementById("profile-name"),
  profileEmail: document.getElementById("profile-email"),
  profilePassword: document.getElementById("profile-password"),
  updateProfileBtn: document.getElementById("update-profile"),
  logoutBtn: document.getElementById("logout-btn"),

  // Task lists
  todoList: document.getElementById("todo-list"),
  inProgressList: document.getElementById("in-progress-list"),
  doneList: document.getElementById("done-list"),
  archivedTasksList: document.getElementById("archived-tasks-list"),

  // Stats
  totalTasks: document.getElementById("total-tasks"),
  completedTasks: document.getElementById("completed-tasks"),
  inprogressTasks: document.getElementById("inprogress-tasks"),
  overdueTasks: document.getElementById("overdue-tasks"),
  overallProgress: document.getElementById("overall-progress"),

  // Calendar
  calendarView: document.getElementById("calendar-view"),
  kanbanView: document.getElementById("kanban-view"),
  calendarMonthYear: document.getElementById("calendar-month-year"),
  calendarGrid: document.getElementById("calendar-grid"),
  prevMonth: document.getElementById("prev-month"),
  nextMonth: document.getElementById("next-month"),

  // Search and filters
  searchInput: document.getElementById("search-input"),
  sortSelect: document.getElementById("sort-select"),
  tagsFilter: document.getElementById("tags-filter"),

  // Notification
  notification: document.getElementById("notification"),
  notificationIcon: document.getElementById("notification-icon"),
  notificationMessage: document.getElementById("notification-message"),
  notificationAction: document.getElementById("notification-action"),

  // Importance selector
  importanceOptions: document.querySelectorAll(".importance-option"),
  modalImportanceOptions: document.querySelectorAll(
    ".modal-actions .importance-option"
  ),
};

// Initialize the application
function initApp() {
  console.log("Initializing SchedulePro App...");

  // Set up event listeners
  setupEventListeners();

  // Set default due date to today
  const today = new Date().toISOString().split("T")[0];
  elements.taskDueDate.value = today;

  // Set up drag and drop
  setupDragAndDrop();

  // Check authentication state
  checkAuthState();

  // Load settings
  loadSettings();

  // Initialize charts
  initCharts();

  // Generate calendar
  generateCalendar(currentMonth, currentYear);

  console.log("App initialized successfully");
}

// Set up all event listeners
function setupEventListeners() {
  console.log("Setting up event listeners...");

  // Form submission
  elements.addTaskBtn.addEventListener("click", addTask);
  elements.saveTaskBtn.addEventListener("click", saveTask);
  elements.toggleFormBtn.addEventListener("click", toggleForm);

  // Modal controls
  elements.closeModalBtns.forEach((btn) => {
    btn.addEventListener("click", closeAllModals);
  });

  elements.closeHelpModal.addEventListener("click", () =>
    closeModal(elements.helpModal)
  );
  elements.closeAuthModal.addEventListener("click", () =>
    closeModal(elements.authModal)
  );
  elements.closeSettingsModal.addEventListener("click", () =>
    closeModal(elements.settingsModal)
  );
  elements.closeArchiveModal.addEventListener("click", () =>
    closeModal(elements.archiveModal)
  );
  elements.closeProfileModal.addEventListener("click", () =>
    closeModal(elements.profileModal)
  );

  // Modal actions
  elements.saveChangesBtn.addEventListener("click", updateTask);
  elements.deleteTaskBtn.addEventListener("click", deleteTask);
  elements.archiveTaskBtn.addEventListener("click", archiveTask);

  // UI controls
  elements.modeToggle.addEventListener("click", toggleDarkMode);
  elements.viewToggle.addEventListener("click", toggleView);
  elements.helpBtn.addEventListener("click", () =>
    openModal(elements.helpModal)
  );
  elements.authBtn.addEventListener("click", () =>
    openModal(elements.authModal)
  );
  elements.settingsBtn.addEventListener("click", () =>
    openModal(elements.settingsModal)
  );
  elements.showArchivedBtn.addEventListener("click", showArchivedTasks);
  elements.exportBtn.addEventListener("click", exportTasks);
  elements.importBtn.addEventListener("click", () =>
    elements.importFile.click()
  );
  elements.importFile.addEventListener("change", importTasks);
  elements.archiveCompletedBtn.addEventListener("click", archiveCompletedTasks);
  elements.showAllBtn.addEventListener("click", () => filterTasks("all"));
  elements.showActiveBtn.addEventListener("click", () => filterTasks("active"));
  elements.showCompletedBtn.addEventListener("click", () =>
    filterTasks("completed")
  );
  elements.clearCompletedBtn.addEventListener("click", clearCompletedTasks);

  // Auth events
  elements.loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    loginUser();
  });

  elements.signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    registerUser();
  });

  elements.switchToSignup.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthForm("signup");
  });

  elements.switchToLogin.addEventListener("click", (e) => {
    e.preventDefault();
    switchAuthForm("login");
  });

  elements.googleLogin.addEventListener("click", signInWithGoogle);
  elements.googleRegister.addEventListener("click", signInWithGoogle);

  // Settings events
  elements.saveSettingsBtn.addEventListener("click", saveSettings);

  // Profile events
  elements.updateProfileBtn.addEventListener("click", updateProfile);
  elements.logoutBtn.addEventListener("click", logoutUser);

  // Calendar events
  elements.prevMonth.addEventListener("click", () => changeMonth(-1));
  elements.nextMonth.addEventListener("click", () => changeMonth(1));

  // Search and filter events
  elements.searchInput.addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase();
    filterAndRenderTasks();
  });

  elements.sortSelect.addEventListener("change", (e) => {
    currentSort = e.target.value;
    filterAndRenderTasks();
  });

  elements.tagsFilter.addEventListener("change", (e) => {
    currentTagFilter = e.target.value;
    filterAndRenderTasks();
  });

  // Importance selection
  elements.importanceOptions.forEach((option) => {
    option.addEventListener("click", () =>
      selectImportance(option, elements.importanceOptions)
    );
  });

  elements.modalImportanceOptions.forEach((option) => {
    option.addEventListener("click", () =>
      selectImportance(option, elements.modalImportanceOptions)
    );
  });

  // Close modals when clicking outside
  document.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeAllModals();
    }
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", handleKeyboardShortcuts);

  console.log("Event listeners set up successfully");
}

// Check authentication state
function checkAuthState() {
  auth.onAuthStateChanged((user) => {
    if (user) {
      // User is signed in
      currentUser = user;
      elements.authBtn.innerHTML = '<i class="fas fa-user"></i>Profile';
      elements.authBtn.removeEventListener("click", () =>
        openModal(elements.authModal)
      );
      elements.authBtn.addEventListener("click", () =>
        openModal(elements.profileModal)
      );

      // Load user tasks
      loadTasks();

      // Update profile info
      elements.profileName.value = user.displayName || "";
      elements.profileEmail.value = user.email;

      showNotification("Successfully signed in!", "success");
    } else {
      // User is signed out
      currentUser = null;
      elements.authBtn.innerHTML = '<i class="fas fa-user"></i>Login';
      elements.authBtn.removeEventListener("click", () =>
        openModal(elements.profileModal)
      );
      elements.authBtn.addEventListener("click", () =>
        openModal(elements.authModal)
      );

      // Clear tasks
      tasks = [];
      renderTasks();
      updateStats();

      showNotification("Signed out successfully", "info");
    }
  });
}

// Load tasks from Firestore
function loadTasks() {
  if (!currentUser) {
    console.log("No user logged in, cannot load tasks");
    return;
  }

  console.log("Loading tasks for user:", currentUser.uid);

  db.collection("users")
    .doc(currentUser.uid)
    .collection("tasks")
    .orderBy("createdAt", "desc")
    .onSnapshot(
      (snapshot) => {
        tasks = [];
        snapshot.forEach((doc) => {
          const task = doc.data();
          task.id = doc.id;
          tasks.push(task);
        });

        console.log(`Loaded ${tasks.length} tasks`);
        filterAndRenderTasks();
        updateStats();
        generateCalendar(currentMonth, currentYear);
        updateCharts();
      },
      (error) => {
        console.error("Error loading tasks:", error);
        showNotification("Error loading tasks", "error");
      }
    );
}

// Add a new task
function addTask() {
  console.log("Adding new task...");

  // Validate form
  if (!elements.taskTitle.value.trim()) {
    showNotification("Task title is required", "error");
    elements.taskTitle.focus();
    return;
  }

  // Get form values
  const title = elements.taskTitle.value.trim();
  const description = elements.taskDescription.value.trim();
  const dueDate = elements.taskDueDate.value;
  const startTime = elements.taskStartTime.value;
  const endTime = elements.taskEndTime.value;
  const recurrence = elements.taskRecurrence.value;
  const difficulty = elements.taskDifficulty.value;
  const reminder = elements.taskReminder.value;

  // Get selected importance
  const selectedImportance = document.querySelector(
    ".importance-option.selected"
  );
  const importance = selectedImportance
    ? parseInt(selectedImportance.dataset.importance)
    : 1;

  // Get checkpoints
  const checkpointsText = elements.taskCheckpoints.value.trim();
  const checkpoints = checkpointsText
    ? checkpointsText.split("\n").map((cp) => ({
        text: cp.trim(),
        completed: false,
      }))
    : [];

  // Get selected tags
  const selectedTags = [];
  for (let option of elements.taskTags.options) {
    if (option.selected) {
      selectedTags.push(option.value);
    }
  }

  // Calculate progress based on checkpoints
  const progress =
    checkpoints.length > 0
      ? Math.round(
          (checkpoints.filter((cp) => cp.completed).length /
            checkpoints.length) *
            100
        )
      : 0;

  // Create task object
  const task = {
    title,
    description,
    dueDate,
    startTime,
    endTime,
    recurrence,
    difficulty,
    importance,
    checkpoints,
    tags: selectedTags,
    reminder,
    progress,
    status: "todo",
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    archived: false,
  };

  // Add to Firestore if user is logged in, otherwise to local storage
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .add(task)
      .then((docRef) => {
        console.log("Task added with ID: ", docRef.id);
        showNotification("Task added successfully!", "success");
        resetForm();
      })
      .catch((error) => {
        console.error("Error adding task: ", error);
        showNotification("Error adding task", "error");
      });
  } else {
    // Local storage fallback
    task.id = "local-" + Date.now();
    tasks.push(task);
    saveTasksToLocalStorage();
    renderTasks();
    updateStats();
    showNotification("Task added successfully!", "success");
    resetForm();
  }
}

// Save task (update existing)
function saveTask() {
  if (!currentEditingTaskId) return;

  console.log("Saving task:", currentEditingTaskId);

  // Get form values
  const title = elements.taskTitle.value.trim();
  const description = elements.taskDescription.value.trim();
  const dueDate = elements.taskDueDate.value;
  const startTime = elements.taskStartTime.value;
  const endTime = elements.taskEndTime.value;
  const recurrence = elements.taskRecurrence.value;
  const difficulty = elements.taskDifficulty.value;
  const reminder = elements.taskReminder.value;

  // Get selected importance
  const selectedImportance = document.querySelector(
    ".importance-option.selected"
  );
  const importance = selectedImportance
    ? parseInt(selectedImportance.dataset.importance)
    : 1;

  // Get checkpoints
  const checkpointsText = elements.taskCheckpoints.value.trim();
  const checkpoints = checkpointsText
    ? checkpointsText.split("\n").map((cp) => ({
        text: cp.trim(),
        completed: false,
      }))
    : [];

  // Get selected tags
  const selectedTags = [];
  for (let option of elements.taskTags.options) {
    if (option.selected) {
      selectedTags.push(option.value);
    }
  }

  // Calculate progress based on checkpoints
  const progress =
    checkpoints.length > 0
      ? Math.round(
          (checkpoints.filter((cp) => cp.completed).length /
            checkpoints.length) *
            100
        )
      : 0;

  // Update task object
  const updatedTask = {
    title,
    description,
    dueDate,
    startTime,
    endTime,
    recurrence,
    difficulty,
    importance,
    checkpoints,
    tags: selectedTags,
    reminder,
    progress,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  // Update in Firestore if user is logged in, otherwise in local storage
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(currentEditingTaskId)
      .update(updatedTask)
      .then(() => {
        console.log("Task updated successfully");
        showNotification("Task updated successfully!", "success");
        resetForm();
        closeModal(elements.taskModal);
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
        showNotification("Error updating task", "error");
      });
  } else {
    // Local storage fallback
    const taskIndex = tasks.findIndex(
      (task) => task.id === currentEditingTaskId
    );
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
      showNotification("Task updated successfully!", "success");
      resetForm();
      closeModal(elements.taskModal);
    }
  }
}

// Update task from modal
function updateTask() {
  if (!currentEditingTaskId) return;

  console.log("Updating task:", currentEditingTaskId);

  // Get modal form values
  const title = elements.modalTaskTitle.value.trim();
  const description = elements.modalTaskDescription.value.trim();
  const dueDate = elements.modalTaskDueDate.value;
  const startTime = elements.modalTaskStartTime.value;
  const endTime = elements.modalTaskEndTime.value;
  const recurrence = elements.modalTaskRecurrence.value;
  const difficulty = elements.modalTaskDifficulty.value;
  const reminder = elements.modalTaskReminder.value;

  // Get selected importance from modal
  const selectedImportance = document.querySelector(
    ".modal-actions .importance-option.selected"
  );
  const importance = selectedImportance
    ? parseInt(selectedImportance.dataset.importance)
    : 1;

  // Get selected tags from modal
  const selectedTags = [];
  for (let option of elements.modalTaskTags.options) {
    if (option.selected) {
      selectedTags.push(option.value);
    }
  }

  // Get checkpoints status from modal
  const checkpoints = [];
  const checkpointElements =
    elements.modalCheckpoints.querySelectorAll(".checkpoint-item");
  checkpointElements.forEach((el) => {
    const checkbox = el.querySelector('input[type="checkbox"]');
    const text = el.querySelector(".checkpoint-text").textContent;
    checkpoints.push({
      text: text,
      completed: checkbox.checked,
    });
  });

  // Calculate progress based on checkpoints
  const progress =
    checkpoints.length > 0
      ? Math.round(
          (checkpoints.filter((cp) => cp.completed).length /
            checkpoints.length) *
            100
        )
      : 0;

  // Update task object
  const updatedTask = {
    title,
    description,
    dueDate,
    startTime,
    endTime,
    recurrence,
    difficulty,
    importance,
    checkpoints,
    tags: selectedTags,
    reminder,
    progress,
    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
  };

  // Update in Firestore if user is logged in, otherwise in local storage
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(currentEditingTaskId)
      .update(updatedTask)
      .then(() => {
        console.log("Task updated successfully");
        showNotification("Task updated successfully!", "success");
        closeModal(elements.taskModal);
      })
      .catch((error) => {
        console.error("Error updating task: ", error);
        showNotification("Error updating task", "error");
      });
  } else {
    // Local storage fallback
    const taskIndex = tasks.findIndex(
      (task) => task.id === currentEditingTaskId
    );
    if (taskIndex !== -1) {
      tasks[taskIndex] = { ...tasks[taskIndex], ...updatedTask };
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
      showNotification("Task updated successfully!", "success");
      closeModal(elements.taskModal);
    }
  }
}

// Delete task
function deleteTask() {
  if (!currentEditingTaskId) return;

  if (confirm("Are you sure you want to delete this task?")) {
    if (currentUser) {
      db.collection("users")
        .doc(currentUser.uid)
        .collection("tasks")
        .doc(currentEditingTaskId)
        .delete()
        .then(() => {
          console.log("Task deleted successfully");
          showNotification("Task deleted successfully!", "success");
          closeModal(elements.taskModal);
        })
        .catch((error) => {
          console.error("Error deleting task: ", error);
          showNotification("Error deleting task", "error");
        });
    } else {
      // Local storage fallback
      tasks = tasks.filter((task) => task.id !== currentEditingTaskId);
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
      showNotification("Task deleted successfully!", "success");
      closeModal(elements.taskModal);
    }
  }
}

// Archive task
function archiveTask() {
  if (!currentEditingTaskId) return;

  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(currentEditingTaskId)
      .update({
        archived: true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("Task archived successfully");
        showNotification("Task archived successfully!", "success");
        closeModal(elements.taskModal);
      })
      .catch((error) => {
        console.error("Error archiving task: ", error);
        showNotification("Error archiving task", "error");
      });
  } else {
    // Local storage fallback
    const taskIndex = tasks.findIndex(
      (task) => task.id === currentEditingTaskId
    );
    if (taskIndex !== -1) {
      tasks[taskIndex].archived = true;
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
      showNotification("Task archived successfully!", "success");
      closeModal(elements.taskModal);
    }
  }
}

// Archive all completed tasks
function archiveCompletedTasks() {
  if (confirm("Are you sure you want to archive all completed tasks?")) {
    const completedTasks = tasks.filter(
      (task) => task.status === "done" && !task.archived
    );

    if (currentUser) {
      const batch = db.batch();
      const tasksRef = db
        .collection("users")
        .doc(currentUser.uid)
        .collection("tasks");

      completedTasks.forEach((task) => {
        const taskRef = tasksRef.doc(task.id);
        batch.update(taskRef, {
          archived: true,
          updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
      });

      batch
        .commit()
        .then(() => {
          console.log("All completed tasks archived successfully");
          showNotification(
            "All completed tasks archived successfully!",
            "success"
          );
        })
        .catch((error) => {
          console.error("Error archiving completed tasks: ", error);
          showNotification("Error archiving completed tasks", "error");
        });
    } else {
      // Local storage fallback
      tasks.forEach((task) => {
        if (task.status === "done" && !task.archived) {
          task.archived = true;
        }
      });
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
      showNotification("All completed tasks archived successfully!", "success");
    }
  }
}

// Clear all completed tasks
function clearCompletedTasks() {
  if (
    confirm(
      "Are you sure you want to permanently delete all completed tasks? This action cannot be undone."
    )
  ) {
    const completedTasks = tasks.filter((task) => task.status === "done");

    if (currentUser) {
      const batch = db.batch();
      const tasksRef = db
        .collection("users")
        .doc(currentUser.uid)
        .collection("tasks");

      completedTasks.forEach((task) => {
        const taskRef = tasksRef.doc(task.id);
        batch.delete(taskRef);
      });

      batch
        .commit()
        .then(() => {
          console.log("All completed tasks deleted successfully");
          showNotification(
            "All completed tasks deleted successfully!",
            "success"
          );
        })
        .catch((error) => {
          console.error("Error deleting completed tasks: ", error);
          showNotification("Error deleting completed tasks", "error");
        });
    } else {
      // Local storage fallback
      tasks = tasks.filter((task) => task.status !== "done");
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
      showNotification("All completed tasks deleted successfully!", "success");
    }
  }
}

// Show archived tasks
function showArchivedTasks() {
  const archivedTasks = tasks.filter((task) => task.archived);

  // Clear the list
  elements.archivedTasksList.innerHTML = "";

  if (archivedTasks.length === 0) {
    elements.archivedTasksList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-archive"></i>
        <p>No archived tasks found</p>
      </div>
    `;
  } else {
    archivedTasks.forEach((task) => {
      const taskElement = createArchivedTaskElement(task);
      elements.archivedTasksList.appendChild(taskElement);
    });
  }

  openModal(elements.archiveModal);
}

// Restore archived task
function restoreTask(taskId) {
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        archived: false,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("Task restored successfully");
        showNotification("Task restored successfully!", "success");
      })
      .catch((error) => {
        console.error("Error restoring task: ", error);
        showNotification("Error restoring task", "error");
      });
  } else {
    // Local storage fallback
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].archived = false;
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
      showNotification("Task restored successfully!", "success");
    }
  }
}

// Filter tasks based on current filter and search query
function filterTasks(filter) {
  currentFilter = filter;
  filterAndRenderTasks();
}

// Filter and render tasks based on current filters
function filterAndRenderTasks() {
  let filteredTasks = [...tasks];

  // Apply status filter
  if (currentFilter !== "all") {
    filteredTasks = filteredTasks.filter((task) => {
      if (currentFilter === "active") {
        return task.status !== "done" && !task.archived;
      } else if (currentFilter === "completed") {
        return task.status === "done" && !task.archived;
      }
      return !task.archived;
    });
  } else {
    filteredTasks = filteredTasks.filter((task) => !task.archived);
  }

  // Apply tag filter
  if (currentTagFilter !== "all") {
    filteredTasks = filteredTasks.filter(
      (task) => task.tags && task.tags.includes(currentTagFilter)
    );
  }

  // Apply search query
  if (searchQuery) {
    filteredTasks = filteredTasks.filter(
      (task) =>
        task.title.toLowerCase().includes(searchQuery) ||
        task.description.toLowerCase().includes(searchQuery) ||
        (task.tags &&
          task.tags.some((tag) => tag.toLowerCase().includes(searchQuery)))
    );
  }

  // Apply sorting
  filteredTasks.sort((a, b) => {
    switch (currentSort) {
      case "date-added-asc":
        return new Date(a.createdAt) - new Date(b.createdAt);
      case "date-added-desc":
        return new Date(b.createdAt) - new Date(a.createdAt);
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

  renderTasks(filteredTasks);
}

// Render tasks to the DOM
function renderTasks(tasksToRender = tasks) {
  console.log("Rendering tasks...");

  // Clear all lists
  elements.todoList.innerHTML = "";
  elements.inProgressList.innerHTML = "";
  elements.doneList.innerHTML = "";

  // Filter out archived tasks
  const activeTasks = tasksToRender.filter((task) => !task.archived);

  if (activeTasks.length === 0) {
    // Show empty state in all columns
    elements.todoList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <p>No tasks to do. Add a new task!</p>
      </div>
    `;

    elements.inProgressList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-spinner"></i>
        <p>No tasks in progress</p>
      </div>
    `;

    elements.doneList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-check-circle"></i>
        <p>No tasks completed yet</p>
      </div>
    `;

    return;
  }

  // Group tasks by status
  const todoTasks = activeTasks.filter((task) => task.status === "todo");
  const inProgressTasks = activeTasks.filter(
    (task) => task.status === "in-progress"
  );
  const doneTasks = activeTasks.filter((task) => task.status === "done");

  // Render todo tasks
  if (todoTasks.length === 0) {
    elements.todoList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-clipboard-list"></i>
        <p>No tasks to do</p>
      </div>
    `;
  } else {
    todoTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      elements.todoList.appendChild(taskElement);
    });
  }

  // Render in progress tasks
  if (inProgressTasks.length === 0) {
    elements.inProgressList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-spinner"></i>
        <p>No tasks in progress</p>
      </div>
    `;
  } else {
    inProgressTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      elements.inProgressList.appendChild(taskElement);
    });
  }

  // Render done tasks
  if (doneTasks.length === 0) {
    elements.doneList.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-check-circle"></i>
        <p>No tasks completed yet</p>
      </div>
    `;
  } else {
    doneTasks.forEach((task) => {
      const taskElement = createTaskElement(task);
      elements.doneList.appendChild(taskElement);
    });
  }
}

// Create a task element for the DOM
function createTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-card";
  taskElement.draggable = true;
  taskElement.dataset.id = task.id;

  // Format due date
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  // Create checkpoints HTML if any
  let checkpointsHTML = "";
  if (task.checkpoints && task.checkpoints.length > 0) {
    const completedCount = task.checkpoints.filter((cp) => cp.completed).length;
    checkpointsHTML = `
      <div class="task-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${task.progress}%"></div>
        </div>
        <div class="progress-text">${completedCount}/${task.checkpoints.length} checkpoints completed</div>
      </div>
    `;
  }

  // Create tags HTML if any
  let tagsHTML = "";
  if (task.tags && task.tags.length > 0) {
    tagsHTML = `
      <div class="task-tags">
        ${task.tags
          .map((tag) => `<span class="task-tag">${tag}</span>`)
          .join("")}
      </div>
    `;
  }

  taskElement.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${task.title}</h3>
      <span class="task-difficulty ${task.difficulty}">${task.difficulty}</span>
    </div>
    <p class="task-description">${task.description || "No description"}</p>
    ${checkpointsHTML}
    ${tagsHTML}
    <div class="task-meta">
      <span class="task-date">Due: ${dueDate}</span>
      <span class="task-importance" data-importance="${task.importance}">${
    task.importance
  }</span>
    </div>
    <div class="task-actions">
      <button class="btn-info edit-task" data-id="${task.id}">
        <i class="fas fa-edit"></i>Edit
      </button>
      <button class="btn-success complete-task" data-id="${task.id}">
        <i class="fas fa-check"></i>Complete
      </button>
    </div>
  `;

  // Add event listeners to buttons
  taskElement
    .querySelector(".edit-task")
    .addEventListener("click", () => editTask(task.id));
  taskElement
    .querySelector(".complete-task")
    .addEventListener("click", () => completeTask(task.id));

  // Add drag event listeners
  taskElement.addEventListener("dragstart", handleDragStart);
  taskElement.addEventListener("dragend", handleDragEnd);

  return taskElement;
}

// Create an archived task element for the DOM
function createArchivedTaskElement(task) {
  const taskElement = document.createElement("div");
  taskElement.className = "task-card";
  taskElement.dataset.id = task.id;

  // Format due date
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString()
    : "No due date";

  taskElement.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${task.title}</h3>
      <span class="task-difficulty ${task.difficulty}">${task.difficulty}</span>
    </div>
    <p class="task-description">${task.description || "No description"}</p>
    <div class="task-meta">
      <span class="task-date">Due: ${dueDate}</span>
      <span class="task-importance" data-importance="${task.importance}">${
    task.importance
  }</span>
    </div>
    <div class="task-actions">
      <button class="btn-info restore-task" data-id="${task.id}">
        <i class="fas fa-undo"></i>Restore
      </button>
    </div>
  `;

  // Add event listener to restore button
  taskElement
    .querySelector(".restore-task")
    .addEventListener("click", () => restoreTask(task.id));

  return taskElement;
}

// Edit task
function editTask(taskId) {
  console.log("Editing task:", taskId);

  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  currentEditingTaskId = taskId;

  // Fill the modal form with task data
  elements.modalTaskTitle.value = task.title;
  elements.modalTaskDescription.value = task.description || "";
  elements.modalTaskDueDate.value = task.dueDate || "";
  elements.modalTaskStartTime.value = task.startTime || "";
  elements.modalTaskEndTime.value = task.endTime || "";
  elements.modalTaskRecurrence.value = task.recurrence || "none";
  elements.modalTaskDifficulty.value = task.difficulty || "medium";
  elements.modalTaskReminder.value = task.reminder || "none";

  // Set importance
  document
    .querySelectorAll(".modal-actions .importance-option")
    .forEach((option) => {
      option.classList.remove("selected");
      if (parseInt(option.dataset.importance) === task.importance) {
        option.classList.add("selected");
      }
    });

  // Set tags
  for (let option of elements.modalTaskTags.options) {
    option.selected = task.tags && task.tags.includes(option.value);
  }

  // Create checkpoints container
  elements.modalCheckpoints.innerHTML = `
      <div class="checkpoints-container" id="modal-checkpoints-container"></div>
      <div class="add-checkpoint-form">
          <input type="text" id="new-checkpoint-input" placeholder="Add a new checkpoint">
          <button class="add-checkpoint-btn" id="add-checkpoint-btn">
              <i class="fas fa-plus"></i> Add
          </button>
      </div>
  `;

  const checkpointsContainer = document.getElementById(
    "modal-checkpoints-container"
  );

  // Add existing checkpoints
  if (task.checkpoints && task.checkpoints.length > 0) {
    task.checkpoints.forEach((checkpoint, index) => {
      const checkpointElement = document.createElement("div");
      checkpointElement.className = `checkpoint-item ${
        checkpoint.completed ? "completed" : ""
      }`;
      checkpointElement.innerHTML = `
              <input type="checkbox" id="checkpoint-${index}" ${
        checkpoint.completed ? "checked" : ""
      }>
              <label for="checkpoint-${index}" class="checkpoint-text">${
        checkpoint.text
      }</label>
          `;

      // Add event listener to update task when checkbox is toggled
      const checkbox = checkpointElement.querySelector(
        'input[type="checkbox"]'
      );
      checkbox.addEventListener("change", () => {
        updateCheckpointStatus(taskId, index, checkbox.checked);
        checkpointElement.classList.toggle("completed", checkbox.checked);
      });

      checkpointsContainer.appendChild(checkpointElement);
    });
  } else {
    checkpointsContainer.innerHTML =
      '<p class="text-center">No checkpoints added yet</p>';
  }

  // Add event listener for adding new checkpoints
  document
    .getElementById("add-checkpoint-btn")
    .addEventListener("click", addNewCheckpoint);
  document
    .getElementById("new-checkpoint-input")
    .addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        addNewCheckpoint();
      }
    });

  openModal(elements.taskModal);
}

// Add new checkpoint to task
function addNewCheckpoint() {
  const input = document.getElementById("new-checkpoint-input");
  const text = input.value.trim();

  if (!text) return;

  const taskId = currentEditingTaskId;
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  // Create new checkpoint
  const newCheckpoint = {
    text: text,
    completed: false,
  };

  // Update task with new checkpoint
  if (!task.checkpoints) {
    task.checkpoints = [];
  }

  task.checkpoints.push(newCheckpoint);

  // Update in Firestore if user is logged in, otherwise in local storage
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        checkpoints: task.checkpoints,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("Checkpoint added successfully");
        // Refresh the checkpoints display
        editTask(taskId);
        input.value = "";
      })
      .catch((error) => {
        console.error("Error adding checkpoint: ", error);
        showNotification("Error adding checkpoint", "error");
      });
  } else {
    // Local storage fallback
    saveTasksToLocalStorage();
    // Refresh the checkpoints display
    editTask(taskId);
    input.value = "";
    showNotification("Checkpoint added successfully!", "success");
  }
}

// Complete task
function completeTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  if (task.status === "done") {
    // If already done, mark as todo
    updateTaskStatus(taskId, "todo");
    showNotification("Task marked as todo", "info");
  } else {
    // Mark as done
    updateTaskStatus(taskId, "done");
    showNotification("Task completed!", "success");
  }
}

// Update task status
function updateTaskStatus(taskId, status) {
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        status: status,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("Task status updated successfully");
      })
      .catch((error) => {
        console.error("Error updating task status: ", error);
        showNotification("Error updating task status", "error");
      });
  } else {
    // Local storage fallback
    const taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
      tasks[taskIndex].status = status;
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
    }
  }
}

// Set up drag and drop functionality
function setupDragAndDrop() {
  const taskLists = document.querySelectorAll(".task-list");

  taskLists.forEach((list) => {
    list.addEventListener("dragover", handleDragOver);
    list.addEventListener("dragenter", handleDragEnter);
    list.addEventListener("dragleave", handleDragLeave);
    list.addEventListener("drop", handleDrop);
  });
}

// Handle drag start
function handleDragStart(e) {
  e.dataTransfer.setData("text/plain", e.target.dataset.id);
  e.target.classList.add("dragging");
}

// Handle drag end
function handleDragEnd(e) {
  e.target.classList.remove("dragging");
}

// Handle drag over
function handleDragOver(e) {
  e.preventDefault();
}

// Handle drag enter
function handleDragEnter(e) {
  e.preventDefault();
  e.target.classList.add("drag-over");
}

// Handle drag leave
function handleDragLeave(e) {
  e.target.classList.remove("drag-over");
}

// Handle drop
function handleDrop(e) {
  e.preventDefault();
  e.target.classList.remove("drag-over");

  const taskId = e.dataTransfer.getData("text/plain");
  const newStatus = e.target.closest(".category").dataset.status;

  updateTaskStatus(taskId, newStatus);
}

// Reset form
function resetForm() {
  elements.taskTitle.value = "";
  elements.taskDescription.value = "";
  elements.taskDueDate.value = new Date().toISOString().split("T")[0];
  elements.taskStartTime.value = "";
  elements.taskEndTime.value = "";
  elements.taskRecurrence.value = "none";
  elements.taskDifficulty.value = "medium";
  elements.taskCheckpoints.value = "";
  elements.taskReminder.value = "none";

  // Reset importance selection
  document.querySelectorAll(".importance-option").forEach((option) => {
    option.classList.remove("selected");
  });
  document
    .querySelector('.importance-option[data-importance="1"]')
    .classList.add("selected");

  // Reset tags selection
  for (let option of elements.taskTags.options) {
    option.selected = false;
  }

  elements.saveTaskBtn.disabled = true;
  currentEditingTaskId = null;
}

function validatePasswordRequirements(password, confirmPassword = "") {
  const requirements = {
    length: password.length >= 8,
    upper: /[A-Z]/.test(password),
    lower: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    match: password === confirmPassword && password !== "",
  };

  // Update UI for each requirement
  document
    .getElementById("req-length")
    .classList.toggle("met", requirements.length);
  document
    .getElementById("req-upper")
    .classList.toggle("met", requirements.upper);
  document
    .getElementById("req-lower")
    .classList.toggle("met", requirements.lower);
  document
    .getElementById("req-number")
    .classList.toggle("met", requirements.number);
  document
    .getElementById("req-special")
    .classList.toggle("met", requirements.special);
  document
    .getElementById("req-match")
    .classList.toggle("met", requirements.match);

  return requirements;
}

// Add this function to check if all requirements are met
function allRequirementsMet(requirements) {
  return (
    requirements.length &&
    requirements.upper &&
    requirements.lower &&
    requirements.number &&
    requirements.special &&
    requirements.match
  );
}

// Add event listeners for password input validation
document.addEventListener("DOMContentLoaded", function () {
  const signupPassword = document.getElementById("signup-password");
  const signupConfirmPassword = document.getElementById(
    "signup-confirm-password"
  );

  if (signupPassword) {
    signupPassword.addEventListener("input", function () {
      validatePasswordRequirements(this.value, signupConfirmPassword.value);
    });
  }

  if (signupConfirmPassword) {
    signupConfirmPassword.addEventListener("input", function () {
      validatePasswordRequirements(signupPassword.value, this.value);
    });
  }
});

// Update the registerUser function to use the validation
function registerUser() {
  const username = elements.signupUsername.value;
  const email = elements.signupEmail.value;
  const password = elements.signupPassword.value;
  const confirmPassword = elements.signupConfirmPassword.value;

  if (!username || !email || !password || !confirmPassword) {
    showNotification("Please fill all fields", "error");
    return;
  }

  // Validate password requirements
  const requirements = validatePasswordRequirements(password, confirmPassword);
  if (!allRequirementsMet(requirements)) {
    showNotification("Please meet all password requirements", "error");
    return;
  }

  // Rest of the registration code remains the same...
  elements.registerStatus.textContent = "Creating account...";
  elements.registerStatus.style.display = "block";
  elements.registerStatus.style.color = "var(--info)";

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;

      // Update profile with username
      return user.updateProfile({
        displayName: username,
      });
    })
    .then(() => {
      elements.registerStatus.textContent = "Account created successfully!";
      elements.registerStatus.style.color = "var(--success)";
      setTimeout(() => {
        closeModal(elements.authModal);
      }, 1000);
    })
    .catch((error) => {
      console.error("Registration error:", error);
      elements.registerStatus.textContent = error.message;
      elements.registerStatus.style.color = "var(--danger)";
    });
}

// Toggle form visibility
function toggleForm() {
  const formContent = document.getElementById("form-content");
  const isCollapsed = formContent.classList.contains("collapsed");

  if (isCollapsed) {
    // Expand the form
    formContent.classList.remove("collapsed");
    formContent.classList.add("expanded");
    formContent.style.display = "block";
    elements.toggleFormBtn.innerHTML = '<i class="fas fa-minus"></i>Collapse';

    // Force reflow to ensure animation plays
    void formContent.offsetWidth;
  } else {
    // Collapse the form
    formContent.classList.remove("expanded");
    formContent.classList.add("collapsed");
    elements.toggleFormBtn.innerHTML = '<i class="fas fa-plus"></i>Expand';

    // Hide the form after animation completes
    setTimeout(() => {
      if (formContent.classList.contains("collapsed")) {
        formContent.style.display = "none";
      }
    }, 500); // Match the animation duration
  }
}

// Toggle dark mode
function toggleDarkMode() {
  const isDarkMode = document.body.classList.contains("dark-mode");

  if (isDarkMode) {
    document.body.classList.remove("dark-mode");
    document.body.classList.add("light-mode");
    elements.modeToggle.textContent = "☀️";
    localStorage.setItem("theme", "light");
  } else {
    document.body.classList.remove("light-mode");
    document.body.classList.add("dark-mode");
    elements.modeToggle.textContent = "🌙";
    localStorage.setItem("theme", "dark");
  }
}

// Toggle view between kanban and calendar
function toggleView() {
  if (currentView === "kanban") {
    elements.kanbanView.style.display = "none";
    elements.calendarView.style.display = "block";
    elements.viewToggle.innerHTML = '<i class="fas fa-columns"></i>Kanban View';
    currentView = "calendar";
  } else {
    elements.kanbanView.style.display = "grid";
    elements.calendarView.style.display = "none";
    elements.viewToggle.innerHTML =
      '<i class="fas fa-calendar"></i>Calendar View';
    currentView = "kanban";
  }

  localStorage.setItem("view", currentView);
}

// Generate calendar
function generateCalendar(month, year) {
  console.log("Generating calendar for:", month, year);

  // Update calendar header
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
  elements.calendarMonthYear.textContent = `${monthNames[month]} ${year}`;

  // Clear calendar grid
  elements.calendarGrid.innerHTML = "";

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Create day headers
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-day-header";
    dayHeader.textContent = day;
    elements.calendarGrid.appendChild(dayHeader);
  });

  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day empty";
    elements.calendarGrid.appendChild(emptyDay);
  }

  // Add cells for each day of the month
  const today = new Date();
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";

    // Check if this day is today
    if (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    ) {
      dayElement.classList.add("today");
    }

    // Add day number
    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-day-header";
    dayHeader.textContent = day;
    dayElement.appendChild(dayHeader);

    // Add tasks for this day
    const tasksContainer = document.createElement("div");
    tasksContainer.className = "calendar-tasks";

    const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const dayTasks = tasks.filter(
      (task) => task.dueDate === currentDate && !task.archived
    );

    if (dayTasks.length > 0) {
      dayTasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = "calendar-task";
        taskElement.textContent = task.title;
        taskElement.addEventListener("click", () => editTask(task.id));
        tasksContainer.appendChild(taskElement);
      });
    }

    dayElement.appendChild(tasksContainer);
    elements.calendarGrid.appendChild(dayElement);
  }
}

// Change calendar month
function changeMonth(direction) {
  currentMonth += direction;

  if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
  } else if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  }

  generateCalendar(currentMonth, currentYear);
}

// Update statistics
function updateStats() {
  const total = tasks.filter((task) => !task.archived).length;
  const completed = tasks.filter(
    (task) => task.status === "done" && !task.archived
  ).length;
  const inProgress = tasks.filter(
    (task) => task.status === "in-progress" && !task.archived
  ).length;

  // Calculate overdue tasks
  const today = new Date().toISOString().split("T")[0];
  const overdue = tasks.filter(
    (task) =>
      task.dueDate &&
      task.dueDate < today &&
      task.status !== "done" &&
      !task.archived
  ).length;

  // Calculate overall progress
  const overallProgress = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Update DOM
  elements.totalTasks.textContent = total;
  elements.completedTasks.textContent = completed;
  elements.inprogressTasks.textContent = inProgress;
  elements.overdueTasks.textContent = overdue;
  elements.overallProgress.textContent = `${overallProgress}%`;
}

// Initialize charts
function initCharts() {
  console.log("Initializing charts...");

  // Completion trend chart
  const completionCtx = document
    .getElementById("completion-chart")
    .getContext("2d");
  window.completionChart = new Chart(completionCtx, {
    type: "line",
    data: {
      labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      datasets: [
        {
          label: "Tasks Completed",
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#6c5ce7",
          tension: 0.3,
          fill: true,
          backgroundColor: "rgba(108, 92, 231, 0.1)",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Weekly Completion Trend",
        },
      },
    },
  });

  // Status chart
  const statusCtx = document.getElementById("status-chart").getContext("2d");
  window.statusChart = new Chart(statusCtx, {
    type: "doughnut",
    data: {
      labels: ["To Do", "In Progress", "Completed"],
      datasets: [
        {
          data: [0, 0, 0],
          backgroundColor: ["#74b9ff", "#fdcb6e", "#00b894"],
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          position: "bottom",
        },
      },
    },
  });

  // Weekly productivity chart
  const weeklyCtx = document.getElementById("weekly-chart").getContext("2d");
  window.weeklyChart = new Chart(weeklyCtx, {
    type: "bar",
    data: {
      labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
      datasets: [
        {
          label: "Tasks Completed",
          data: [0, 0, 0, 0],
          backgroundColor: "#6c5ce7",
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: "Monthly Productivity",
        },
      },
    },
  });
}

function updateCheckpointStatus(taskId, checkpointIndex, completed) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task || !task.checkpoints || !task.checkpoints[checkpointIndex]) return;

  // Update checkpoint status
  task.checkpoints[checkpointIndex].completed = completed;

  // Calculate new progress
  const totalCheckpoints = task.checkpoints.length;
  const completedCheckpoints = task.checkpoints.filter(
    (cp) => cp.completed
  ).length;
  const progress =
    totalCheckpoints > 0
      ? Math.round((completedCheckpoints / totalCheckpoints) * 100)
      : 0;

  // Determine new status based on checkpoint completion
  let newStatus = task.status;
  if (completedCheckpoints === totalCheckpoints && totalCheckpoints > 0) {
    newStatus = "done"; // All checkpoints completed
  } else if (
    completedCheckpoints > 0 &&
    completedCheckpoints < totalCheckpoints
  ) {
    newStatus = "in-progress"; // Some checkpoints completed
  } else if (completedCheckpoints === 0) {
    newStatus = "todo"; // No checkpoints completed
  }

  // Update in Firestore if user is logged in, otherwise in local storage
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        checkpoints: task.checkpoints,
        progress: progress,
        status: newStatus,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("Checkpoint status updated successfully");
        updateStats();

        // Show animation for status change
        if (newStatus !== task.status) {
          const statusNames = {
            todo: "To Do",
            "in-progress": "In Progress",
            done: "Done",
          };
          showNotification(
            `Task moved to ${statusNames[newStatus]}!`,
            "success"
          );
        }
      })
      .catch((error) => {
        console.error("Error updating checkpoint status: ", error);
        showNotification("Error updating checkpoint", "error");
      });
  } else {
    // Local storage fallback
    task.progress = progress;
    task.status = newStatus;
    saveTasksToLocalStorage();
    renderTasks();
    updateStats();

    // Show animation for status change
    if (newStatus !== task.status) {
      const statusNames = {
        todo: "To Do",
        "in-progress": "In Progress",
        done: "Done",
      };
      showNotification(`Task moved to ${statusNames[newStatus]}!`, "success");
    } else {
      showNotification("Checkpoint updated!", "success");
    }
  }
}

// Update charts with current data
function updateCharts() {
  if (!window.completionChart || !window.statusChart || !window.weeklyChart)
    return;

  // Update completion trend (mock data for now)
  const completionData = [2, 5, 3, 7, 4, 6, 3];
  window.completionChart.data.datasets[0].data = completionData;
  window.completionChart.update();

  // Update status chart with real data
  const todoCount = tasks.filter(
    (task) => task.status === "todo" && !task.archived
  ).length;
  const inProgressCount = tasks.filter(
    (task) => task.status === "in-progress" && !task.archived
  ).length;
  const doneCount = tasks.filter(
    (task) => task.status === "done" && !task.archived
  ).length;

  window.statusChart.data.datasets[0].data = [
    todoCount,
    inProgressCount,
    doneCount,
  ];
  window.statusChart.update();

  // Update weekly productivity (mock data for now)
  const weeklyData = [8, 12, 9, 15];
  window.weeklyChart.data.datasets[0].data = weeklyData;
  window.weeklyChart.update();
}

// Export tasks to JSON file
function exportTasks() {
  const dataStr = JSON.stringify(tasks, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `schedulepro-tasks-${
    new Date().toISOString().split("T")[0]
  }.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();

  showNotification("Tasks exported successfully!", "success");
}

// Import tasks from JSON file
function importTasks(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedTasks = JSON.parse(e.target.result);

      if (Array.isArray(importedTasks)) {
        if (
          confirm(
            `Import ${importedTasks.length} tasks? This will replace your current tasks.`
          )
        ) {
          if (currentUser) {
            // Import to Firestore
            const batch = db.batch();
            const tasksRef = db
              .collection("users")
              .doc(currentUser.uid)
              .collection("tasks");

            // First, delete existing tasks
            tasks.forEach((task) => {
              const taskRef = tasksRef.doc(task.id);
              batch.delete(taskRef);
            });

            // Then add imported tasks
            importedTasks.forEach((task) => {
              const taskRef = tasksRef.doc();
              batch.set(taskRef, {
                ...task,
                id: taskRef.id,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
              });
            });

            batch
              .commit()
              .then(() => {
                console.log("Tasks imported successfully");
                showNotification("Tasks imported successfully!", "success");
              })
              .catch((error) => {
                console.error("Error importing tasks: ", error);
                showNotification("Error importing tasks", "error");
              });
          } else {
            // Local storage fallback
            tasks = importedTasks;
            saveTasksToLocalStorage();
            renderTasks();
            updateStats();
            showNotification("Tasks imported successfully!", "success");
          }
        }
      } else {
        throw new Error("Invalid file format");
      }
    } catch (error) {
      console.error("Error parsing imported file:", error);
      showNotification("Error importing tasks: Invalid file format", "error");
    }
  };
  reader.readAsText(file);

  // Reset file input
  e.target.value = "";
}

// Save tasks to local storage
function saveTasksToLocalStorage() {
  localStorage.setItem("schedulepro-tasks", JSON.stringify(tasks));
}

// Load tasks from local storage
function loadTasksFromLocalStorage() {
  const storedTasks = localStorage.getItem("schedulepro-tasks");
  if (storedTasks) {
    try {
      tasks = JSON.parse(storedTasks);
      renderTasks();
      updateStats();
    } catch (error) {
      console.error("Error parsing tasks from local storage:", error);
      tasks = [];
    }
  }
}

// Load settings from local storage
function loadSettings() {
  // Load theme
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    document.body.classList.remove("dark-mode", "light-mode");
    document.body.classList.add(savedTheme + "-mode");
    elements.modeToggle.textContent = savedTheme === "dark" ? "🌙" : "☀️";
  }

  // Load view
  const savedView = localStorage.getItem("view");
  if (savedView) {
    currentView = savedView;
    if (savedView === "calendar") {
      elements.kanbanView.style.display = "none";
      elements.calendarView.style.display = "block";
      elements.viewToggle.innerHTML =
        '<i class="fas fa-columns"></i>Kanban View';
    } else {
      elements.kanbanView.style.display = "grid";
      elements.calendarView.style.display = "none";
      elements.viewToggle.innerHTML =
        '<i class="fas fa-calendar"></i>Calendar View';
    }
  }

  // Load other settings
  const defaultTheme = localStorage.getItem("defaultTheme");
  if (defaultTheme) {
    elements.defaultTheme.value = defaultTheme;
  }

  const defaultView = localStorage.getItem("defaultView");
  if (defaultView) {
    elements.defaultView.value = defaultView;
  }

  const reduceMotion = localStorage.getItem("reduceMotion");
  if (reduceMotion) {
    elements.reduceMotion.checked = reduceMotion === "true";
  }

  const disableAnimations = localStorage.getItem("disableAnimations");
  if (disableAnimations) {
    elements.disableAnimations.checked = disableAnimations === "true";
  }
}

// Save settings to local storage
function saveSettings() {
  localStorage.setItem("defaultTheme", elements.defaultTheme.value);
  localStorage.setItem("defaultView", elements.defaultView.value);
  localStorage.setItem("reduceMotion", elements.reduceMotion.checked);
  localStorage.setItem("disableAnimations", elements.disableAnimations.checked);

  showNotification("Settings saved successfully!", "success");
  closeModal(elements.settingsModal);
}

// Select importance level
function selectImportance(option, options) {
  options.forEach((opt) => opt.classList.remove("selected"));
  option.classList.add("selected");
}

// Open modal
function openModal(modal) {
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("visible");
  }, 10);
  void modal.offsetWidth;
  modal.classList.add("visible");
}

// Close modal
function closeModal(modal) {
  modal.classList.remove("visible");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Close all modals
function closeAllModals() {
  const modals = document.querySelectorAll(".modal-overlay");
  modals.forEach((modal) => {
    closeModal(modal);
  });
}

// Show notification
function showNotification(message, type = "info") {
  elements.notificationMessage.textContent = message;

  // Set icon based on type
  switch (type) {
    case "success":
      elements.notificationIcon.className = "fas fa-check-circle";
      elements.notification.style.borderLeft = "4px solid var(--success)";
      break;
    case "error":
      elements.notificationIcon.className = "fas fa-exclamation-circle";
      elements.notification.style.borderLeft = "4px solid var(--danger)";
      break;
    case "warning":
      elements.notificationIcon.className = "fas fa-exclamation-triangle";
      elements.notification.style.borderLeft = "4px solid var(--warning)";
      break;
    default:
      elements.notificationIcon.className = "fas fa-info-circle";
      elements.notification.style.borderLeft = "4px solid var(--info)";
  }

  // Show notification
  elements.notification.classList.add("show");

  // Auto hide after 5 seconds
  setTimeout(() => {
    elements.notification.classList.remove("show");
  }, 5000);
}

// Handle keyboard shortcuts
function handleKeyboardShortcuts(e) {
  // Ctrl + N: Add new task
  if (e.ctrlKey && e.key === "n") {
    e.preventDefault();
    elements.taskTitle.focus();
  }

  // Ctrl + F: Focus search
  if (e.ctrlKey && e.key === "f") {
    e.preventDefault();
    elements.searchInput.focus();
  }

  // Ctrl + ,: Open settings
  if (e.ctrlKey && e.key === ",") {
    e.preventDefault();
    openModal(elements.settingsModal);
  }

  // Escape: Close modals
  if (e.key === "Escape") {
    closeAllModals();
  }
}

// Switch between login and signup forms
function switchAuthForm(form) {
  if (form === "signup") {
    elements.loginForm.classList.remove("active");
    elements.signupForm.classList.add("active");
    document.getElementById("auth-modal-title").textContent = "Create Account";
  } else {
    elements.signupForm.classList.remove("active");
    elements.loginForm.classList.add("active");
    document.getElementById("auth-modal-title").textContent = "Login";
  }
}

// Login user with email and password
function loginUser() {
  const email = elements.loginEmail.value;
  const password = elements.loginPassword.value;

  if (!email || !password) {
    showNotification("Please enter both email and password", "error");
    return;
  }

  elements.loginStatus.textContent = "Logging in...";
  elements.loginStatus.style.display = "block";
  elements.loginStatus.style.color = "var(--info)";

  auth
    .signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed in
      elements.loginStatus.textContent = "Login successful!";
      elements.loginStatus.style.color = "var(--success)";
      setTimeout(() => {
        closeModal(elements.authModal);
      }, 1000);
    })
    .catch((error) => {
      console.error("Login error:", error);
      elements.loginStatus.textContent = error.message;
      elements.loginStatus.style.color = "var(--danger)";
    });
}

// Register new user
function registerUser() {
  const username = elements.signupUsername.value;
  const email = elements.signupEmail.value;
  const password = elements.signupPassword.value;
  const confirmPassword = elements.signupConfirmPassword.value;

  if (!username || !email || !password || !confirmPassword) {
    showNotification("Please fill all fields", "error");
    return;
  }

  if (password !== confirmPassword) {
    showNotification("Passwords do not match", "error");
    return;
  }

  elements.registerStatus.textContent = "Creating account...";
  elements.registerStatus.style.display = "block";
  elements.registerStatus.style.color = "var(--info)";

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {
      // Signed up
      const user = userCredential.user;

      // Update profile with username
      return user.updateProfile({
        displayName: username,
      });
    })
    .then(() => {
      elements.registerStatus.textContent = "Account created successfully!";
      elements.registerStatus.style.color = "var(--success)";
      setTimeout(() => {
        closeModal(elements.authModal);
      }, 1000);
    })
    .catch((error) => {
      console.error("Registration error:", error);
      elements.registerStatus.textContent = error.message;
      elements.registerStatus.style.color = "var(--danger)";
    });
}

// Sign in with Google
function signInWithGoogle() {
  const provider = new firebase.auth.GoogleAuthProvider();

  auth
    .signInWithPopup(provider)
    .then((result) => {
      // Signed in
      closeModal(elements.authModal);
    })
    .catch((error) => {
      console.error("Google sign-in error:", error);
      showNotification("Error signing in with Google", "error");
    });
}

// Update user profile
function updateProfile() {
  const displayName = elements.profileName.value;
  const newPassword = elements.profilePassword.value;

  if (!displayName) {
    showNotification("Name is required", "error");
    return;
  }

  const promises = [];

  // Update display name
  promises.push(
    currentUser.updateProfile({
      displayName: displayName,
    })
  );

  // Update password if provided
  if (newPassword) {
    promises.push(currentUser.updatePassword(newPassword));
  }

  Promise.all(promises)
    .then(() => {
      showNotification("Profile updated successfully!", "success");
      closeModal(elements.profileModal);
    })
    .catch((error) => {
      console.error("Error updating profile:", error);
      showNotification("Error updating profile: " + error.message, "error");
    });
}

// Logout user
function logoutUser() {
  auth
    .signOut()
    .then(() => {
      closeModal(elements.profileModal);
      showNotification("Logged out successfully", "info");
    })
    .catch((error) => {
      console.error("Logout error:", error);
      showNotification("Error logging out", "error");
    });
}

// Initialize the app when DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);
