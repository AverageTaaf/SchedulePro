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

// Get tag color from custom tags
function getTagColor(tagName) {
  const tagConfig = customTags.find((t) => t.name === tagName);
  return tagConfig ? tagConfig.color : "#6c5ce7";
}

// Get current selected tags from task form
function getCurrentTags() {
  const taskTagsSelect = document.getElementById("task-tags");
  if (!taskTagsSelect) return [];

  return Array.from(taskTagsSelect.selectedOptions).map(option => option.value);
}

// Get current selected tags from modal form
function getCurrentModalTags() {
  const modalTaskTags = document.getElementById("modal-task-tags");
  if (!modalTaskTags) return [];

  return Array.from(modalTaskTags.selectedOptions).map(option => option.value);
}

// Clear form tags selection
function clearFormTags() {
  const taskTagsSelect = document.getElementById("task-tags");
  if (taskTagsSelect) {
    Array.from(taskTagsSelect.options).forEach(option => {
      option.selected = false;
    });
  }
}

// List View Rendering
function renderListView() {
  const container = document.getElementById("list-container");
  if (!container) return;

  container.innerHTML = "";

  const activeTasks = tasks.filter((task) => !task.archived && !task.deleted);

  if (activeTasks.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-list"></i><p>No tasks found</p></div>';
    return;
  }

  activeTasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "list-task-item";

    const priorityClass =
      task.importance === 3
        ? "task-card-priority-high"
        : task.importance === 2
        ? "task-card-priority-medium"
        : "task-card-priority-low";
    item.classList.add(priorityClass);

    item.innerHTML = `
      <input type="checkbox" class="list-task-checkbox" ${
        task.status === "done" ? "checked" : ""
      }>
      <div class="list-task-content">
        <div class="list-task-title">${task.title}</div>
        <div class="list-task-meta">
          <span class="task-difficulty ${task.difficulty}">${
      task.difficulty
    }</span>
          <span class="task-date">${task.dueDate || "No due date"}</span>
          <span class="task-importance" data-importance="${task.importance}">${
      task.importance
    }</span>
        </div>
      </div>
    `;

    item
      .querySelector(".list-task-checkbox")
      .addEventListener("change", (e) => {
        updateTaskStatus(task.id, e.target.checked ? "done" : "todo");
      });

    item.addEventListener("click", (e) => {
      if (e.target.type !== "checkbox") {
        editTask(task.id);
      }
    });

    container.appendChild(item);
  });
}

// Grid View Rendering
function renderGridView() {
  const container = document.getElementById("grid-container");
  if (!container) return;

  container.innerHTML = "";

  const activeTasks = tasks.filter((task) => !task.archived && !task.deleted);

  if (activeTasks.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-th"></i><p>No tasks found</p></div>';
    return;
  }

  activeTasks.forEach((task) => {
    const card = createTaskElement(task);
    card.classList.add("grid-task-card");
    container.appendChild(card);
  });
}

// Timeline View Rendering
function renderTimelineView() {
  const container = document.getElementById("timeline-container");
  if (!container) return;

  container.innerHTML = "";

  const activeTasks = tasks.filter(
    (task) => !task.archived && !task.deleted && task.dueDate
  );

  if (activeTasks.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-stream"></i><p>No tasks with due dates found</p></div>';
    return;
  }

  // Sort by due date
  activeTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  activeTasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    item.innerHTML = `
      <div class="timeline-date">${new Date(task.dueDate).toLocaleDateString(
        "en-US",
        { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      )}</div>
      <h3 class="task-title">${task.title}</h3>
      <p class="task-description">${task.description || "No description"}</p>
      <div class="task-meta">
        <span class="task-difficulty ${task.difficulty}">${
      task.difficulty
    }</span>
        <span class="task-importance" data-importance="${task.importance}">${
      task.importance
    }</span>
      </div>
    `;

    item.addEventListener("click", () => editTask(task.id));
    container.appendChild(item);
  });
}

// Initialize the application
function init() {
  console.log("🚀 Initializing SchedulePro App...");

  // Set up event listeners
  console.log("  ⚙️ Setting up event listeners...");
  setupEventListeners();

  // Set default due date to today
  const today = new Date().toISOString().split("T")[0];
  elements.taskDueDate.value = today;
  console.log("  📅 Default due date set to:", today);

  // Load tasks from local storage
  console.log("  💾 Loading tasks from local storage...");
  loadTasksFromLocalStorage();

  // Render tasks
  console.log("  🎨 Rendering tasks...");
  renderTasks();

  // Update statistics
  console.log("  📊 Updating statistics...");
  updateStats();

  // Set up drag and drop
  console.log("  🖱️ Setting up drag and drop...");
  setupDragAndDrop();

  // Check authentication state
  console.log("  🔐 Checking authentication state...");
  checkAuthState();

  // Load settings
  console.log("  ⚙️ Loading settings...");
  loadSettings();

  // Generate calendar
  console.log("  📆 Generating calendar...");
  generateCalendar(currentMonth, currentYear);

  console.log("✅ App initialized successfully");
}

// Initialize charts when window is fully loaded
window.addEventListener("load", () => {
  console.log("Window loaded, initializing charts...");
  setTimeout(() => {
    initCharts();
  }, 300);
});

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

  if (elements.closeHelpModal) {
    elements.closeHelpModal.addEventListener("click", () =>
      closeModal(elements.helpModal)
    );
  }

  if (elements.closeAuthModal) {
    elements.closeAuthModal.addEventListener("click", () =>
      closeModal(elements.authModal)
    );
  }

  if (elements.closeSettingsModal) {
    elements.closeSettingsModal.addEventListener("click", () =>
      closeModal(elements.settingsModal)
    );
  }

  if (elements.closeArchiveModal) {
    elements.closeArchiveModal.addEventListener("click", () =>
      closeModal(elements.archiveModal)
    );
  }

  if (elements.closeProfileModal) {
    elements.closeProfileModal.addEventListener("click", () =>
      closeModal(elements.profileModal)
    );
  }

  // Modal actions
  elements.saveChangesBtn.addEventListener("click", updateTask);
  elements.deleteTaskBtn.addEventListener("click", deleteTask);
  elements.archiveTaskBtn.addEventListener("click", archiveTask);

  // UI controls
  if (elements.viewToggle) {
    elements.viewToggle.addEventListener("click", toggleView);
  }

  if (elements.helpBtn) {
    elements.helpBtn.addEventListener("click", () => {
      console.log("Help button clicked");
      openModal(elements.helpModal);
    });
  } else {
    console.warn("Help button not found");
  }

  if (elements.authBtn) {
    elements.authBtn.addEventListener("click", () => {
      console.log("Auth button clicked");
      openModal(elements.authModal);
    });
  } else {
    console.warn("Auth button not found");
  }

  if (elements.settingsBtn) {
    elements.settingsBtn.addEventListener("click", () => {
      console.log("Settings button clicked");
      // Update settings modal with current values before opening
      elements.defaultTheme.value = currentTheme;
      openModal(elements.settingsModal);
    });
  } else {
    console.warn("Settings button not found");
  }
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

  // Notification dismiss button
  if (elements.notificationAction) {
    elements.notificationAction.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      console.log("🔔 Dismiss button clicked");
      if (elements.notification) {
        elements.notification.classList.remove("show");
        console.log("  ✓ Notification hidden");
      }
    });
    console.log("✅ Notification dismiss button initialized");
  } else {
    console.warn("⚠️ Notification action button not found");
  }

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

  // Get selected tags from custom tags input
  const selectedTags = getCurrentTags();

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

  // Get selected tags from custom tags input (for save task)
  const selectedTags = getCurrentTags();

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

  // Get selected tags from modal custom input
  const selectedTags = getCurrentModalTags();

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

  // Add priority border
  if (task.importance === 3) {
    taskElement.classList.add("task-card-priority-high");
  } else if (task.importance === 2) {
    taskElement.classList.add("task-card-priority-medium");
  } else {
    taskElement.classList.add("task-card-priority-low");
  }

  // Check if overdue
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

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
          .map((tag) => {
            const tagColor = getTagColor(tag);
            return `<span class="task-tag" style="background-color: ${tagColor}">${tag}</span>`;
          })
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
      <span class="task-date"><i class="fas fa-calendar"></i> ${dueDate}</span>
      <div class="task-importance" data-importance="${task.importance}">${
    task.importance
  }</div>
    </div>
    ${
      isOverdue
        ? '<div class="task-overdue-badge"><i class="fas fa-clock"></i> Overdue</div>'
        : ""
    }
    <div class="task-actions">
      <button class="btn-info btn-sm edit-task" data-id="${task.id}">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn-success btn-sm complete-task" data-id="${task.id}">
        <i class="fas fa-check"></i>
      </button>
    </div>
  `;

  // Add event listeners to buttons
  taskElement
    .querySelector(".edit-task")
    .addEventListener("click", () => editTaskById(task.id));
  taskElement
    .querySelector(".complete-task")
    .addEventListener("click", () => completeTask(task.id));

  // Add drag event listeners
  taskElement.addEventListener("dragstart", handleDragStart);
  taskElement.addEventListener("dragend", handleDragEnd);

  return taskElement;
}

// Helper function for editing task by ID
function editTaskById(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    currentEditingTaskId = taskId;
    openTaskModal(taskId);
  }
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
  clearFormTags();

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
    generateCalendar(currentMonth, currentYear);
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
  const prevMonthDays = new Date(year, month, 0).getDate();

  // Create day headers
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  dayNames.forEach((day) => {
    const dayHeader = document.createElement("div");
    dayHeader.className = "calendar-weekday-header";
    dayHeader.textContent = day;
    elements.calendarGrid.appendChild(dayHeader);
  });

  // Add cells for days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    const emptyDay = document.createElement("div");
    emptyDay.className = "calendar-day other-month";
    const dayNum = document.createElement("div");
    dayNum.className = "calendar-day-number";
    dayNum.textContent = prevMonthDays - i;
    emptyDay.appendChild(dayNum);
    elements.calendarGrid.appendChild(emptyDay);
  }

  // Add cells for each day of the month
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div");
    dayElement.className = "calendar-day";

    const currentDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    const dayDate = new Date(year, month, day);
    dayDate.setHours(0, 0, 0, 0);

    // Check if this day is today
    if (dayDate.getTime() === today.getTime()) {
      dayElement.classList.add("today");
    }

    // Check if weekend
    const dayOfWeek = dayDate.getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      dayElement.classList.add("weekend");
    }

    // Add day number
    const dayNumber = document.createElement("div");
    dayNumber.className = "calendar-day-number";
    dayNumber.textContent = day;
    dayElement.appendChild(dayNumber);

    // Get tasks for this day
    const dayTasks = tasks.filter(
      (task) => task.dueDate === currentDate && !task.archived && !task.deleted
    );

    // Add tasks container
    const tasksContainer = document.createElement("div");
    tasksContainer.className = "calendar-tasks";

    if (dayTasks.length > 0) {
      // Show up to 3 tasks, then show "+X more"
      const visibleTasks = dayTasks.slice(0, 3);

      visibleTasks.forEach((task) => {
        const taskElement = document.createElement("div");
        taskElement.className = "calendar-task";

        // Add status class
        taskElement.classList.add(`status-${task.status}`);

        // Add importance indicator
        const importanceIndicator = document.createElement("span");
        importanceIndicator.className = "task-importance-dot";
        importanceIndicator.dataset.importance = task.importance;

        // Task title
        const taskTitle = document.createElement("span");
        taskTitle.className = "calendar-task-title";
        taskTitle.textContent = task.title;

        // Truncate long titles
        if (task.title.length > 20) {
          taskTitle.textContent = task.title.substring(0, 20) + "...";
          taskTitle.title = task.title; // Show full title on hover
        }

        taskElement.appendChild(importanceIndicator);
        taskElement.appendChild(taskTitle);

        // Add click handler
        taskElement.addEventListener("click", (e) => {
          e.stopPropagation();
          editTask(task.id);
        });

        tasksContainer.appendChild(taskElement);
      });

      // Show "more" indicator if there are more than 3 tasks
      if (dayTasks.length > 3) {
        const moreIndicator = document.createElement("div");
        moreIndicator.className = "calendar-more-tasks";
        moreIndicator.textContent = `+${dayTasks.length - 3} more`;
        moreIndicator.addEventListener("click", (e) => {
          e.stopPropagation();
          showDayTasks(currentDate, dayTasks);
        });
        tasksContainer.appendChild(moreIndicator);
      }
    }

    dayElement.appendChild(tasksContainer);

    // Add click handler to day for adding new task
    dayElement.addEventListener("click", () => {
      elements.taskDueDate.value = currentDate;
      elements.taskTitle.focus();
      showNotification(`Adding task for ${monthNames[month]} ${day}`, "info");
    });

    elements.calendarGrid.appendChild(dayElement);
  }

  // Add cells for days from next month to complete the grid
  const totalCells = elements.calendarGrid.children.length - 7; // Subtract day headers
  const remainingCells = 42 - totalCells - 7; // 6 rows * 7 days - headers

  for (let day = 1; day <= remainingCells; day++) {
    const nextMonthDay = document.createElement("div");
    nextMonthDay.className = "calendar-day other-month";
    const dayNum = document.createElement("div");
    dayNum.className = "calendar-day-number";
    dayNum.textContent = day;
    nextMonthDay.appendChild(dayNum);
    elements.calendarGrid.appendChild(nextMonthDay);
  }
}

// Show all tasks for a specific day
function showDayTasks(date, dayTasks) {
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const modal = document.createElement("div");
  modal.className = "modal-overlay";
  modal.style.display = "flex";
  modal.innerHTML = `
    <div class="task-modal">
      <button class="close-modal">×</button>
      <h2><i class="fas fa-calendar-day"></i> ${formattedDate}</h2>
      <div class="day-tasks-list">
        ${dayTasks
          .map(
            (task) => `
          <div class="day-task-item" data-id="${task.id}">
            <div class="task-header">
              <span class="task-importance-badge" data-importance="${
                task.importance
              }">${task.importance}</span>
              <h3>${task.title}</h3>
              <span class="task-status-badge status-${task.status}">${
              task.status
            }</span>
            </div>
            <p class="task-description">${
              task.description || "No description"
            }</p>
            <div class="task-meta">
              <span class="task-difficulty ${task.difficulty}">${
              task.difficulty
            }</span>
              ${
                task.tags
                  ? task.tags
                      .map((tag) => {
                        const tagConfig = customTags.find(
                          (t) => t.name === tag
                        );
                        return `<span class="task-tag" style="background-color: ${
                          tagConfig ? tagConfig.color : "#6c5ce7"
                        }">${tag}</span>`;
                      })
                      .join("")
                  : ""
              }
            </div>
          </div>
        `
          )
          .join("")}
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Add click handlers
  modal.querySelector(".close-modal").addEventListener("click", () => {
    document.body.removeChild(modal);
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal);
    }
  });

  // Add click handlers to task items
  modal.querySelectorAll(".day-task-item").forEach((item) => {
    item.addEventListener("click", () => {
      const taskId = item.dataset.id;
      document.body.removeChild(modal);
      editTask(taskId);
    });
  });
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

  // Update charts with new data (only if charts are initialized)
  if (window.statusChart || window.completionChart || window.weeklyChart) {
    updateCharts();
  }
}

// Initialize charts
function initCharts() {
  console.log("📈 Initializing charts...");

  // Check if Chart.js is loaded
  if (typeof Chart === "undefined") {
    console.error("❌ Chart.js is not loaded!");
    return;
  }

  try {
    // Completion trend chart
    const completionCanvas = document.getElementById("completion-chart");
    if (completionCanvas) {
      console.log("  🔵 Initializing completion chart...");
      const completionCtx = completionCanvas.getContext("2d");
      window.completionChart = new Chart(completionCtx, {
        type: "line",
        data: {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          datasets: [
            {
              label: "Tasks Completed",
              data: [0, 0, 0, 0, 0, 0, 0],
              borderColor: "#6c5ce7",
              backgroundColor: "rgba(108, 92, 231, 0.2)",
              tension: 0.4,
              fill: true,
              borderWidth: 3,
              pointRadius: 5,
              pointHoverRadius: 7,
              pointBackgroundColor: "#6c5ce7",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: "Weekly Completion Trend",
              font: {
                size: 16,
                weight: "bold",
              },
              color: "#6c5ce7",
            },
            legend: {
              display: true,
              position: "top",
            },
          },
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

    // Status chart
    const statusCanvas = document.getElementById("status-chart");
    if (statusCanvas) {
      console.log("  🟣 Initializing status chart...");
      const statusCtx = statusCanvas.getContext("2d");
      window.statusChart = new Chart(statusCtx, {
        type: "doughnut",
        data: {
          labels: ["To Do", "In Progress", "Completed"],
          datasets: [
            {
              data: [0, 0, 0],
              backgroundColor: ["#74b9ff", "#fdcb6e", "#00b894"],
              borderWidth: 2,
              borderColor: "#fff",
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              position: "bottom",
              labels: {
                padding: 15,
                font: {
                  size: 12,
                },
              },
            },
            title: {
              display: true,
              text: "Tasks by Status",
              font: {
                size: 16,
                weight: "bold",
              },
              color: "#6c5ce7",
            },
          },
        },
      });
    }

    // Weekly productivity chart
    const weeklyCanvas = document.getElementById("weekly-chart");
    if (weeklyCanvas) {
      console.log("  🟢 Initializing weekly chart...");
      const weeklyCtx = weeklyCanvas.getContext("2d");
      window.weeklyChart = new Chart(weeklyCtx, {
        type: "bar",
        data: {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          datasets: [
            {
              label: "Tasks Completed",
              data: [0, 0, 0, 0],
              backgroundColor: "#6c5ce7",
              borderColor: "#5649c9",
              borderWidth: 2,
              borderRadius: 8,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            title: {
              display: true,
              text: "Monthly Productivity",
              font: {
                size: 16,
                weight: "bold",
              },
              color: "#6c5ce7",
            },
            legend: {
              display: true,
              position: "top",
            },
          },
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

    console.log("✅ Charts initialized successfully");

    // Show charts section
    const chartsSection = document.getElementById("charts-section");
    if (chartsSection) {
      chartsSection.style.display = "block";
      console.log("  ✓ Charts section made visible");
    }

    // Update charts with initial data
    setTimeout(() => {
      console.log("⏱️ Updating charts with initial data...");
      updateCharts();
    }, 100);
  } catch (error) {
    console.error("❌ Error initializing charts:", error);
  }
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
  try {
    console.log("📊 Updating charts with task data...");

    // Update status chart with real data
    if (window.statusChart) {
      const todoCount = tasks.filter(
        (task) => task.status === "todo" && !task.archived && !task.deleted
      ).length;
      const inProgressCount = tasks.filter(
        (task) =>
          task.status === "in-progress" && !task.archived && !task.deleted
      ).length;
      const doneCount = tasks.filter(
        (task) => task.status === "done" && !task.archived && !task.deleted
      ).length;

      console.log(
        "  ✓ Status chart - To-Do:",
        todoCount,
        "In Progress:",
        inProgressCount,
        "Done:",
        doneCount
      );

      window.statusChart.data.datasets[0].data = [
        todoCount,
        inProgressCount,
        doneCount,
      ];
      window.statusChart.update();
    } else {
      console.warn("  ⚠ Status chart not yet initialized");
    }

    // Update completion trend - last 7 days
    if (window.completionChart) {
      const completionData = getWeeklyCompletionData();
      console.log("  ✓ Completion chart - Weekly data:", completionData);
      window.completionChart.data.datasets[0].data = completionData;
      window.completionChart.update();
    } else {
      console.warn("  ⚠ Completion chart not yet initialized");
    }

    // Update weekly productivity - last 4 weeks
    if (window.weeklyChart) {
      const weeklyData = getMonthlyProductivityData();
      console.log("  ✓ Weekly chart - Monthly data:", weeklyData);
      window.weeklyChart.data.datasets[0].data = weeklyData;
      window.weeklyChart.update();
    } else {
      console.warn("  ⚠ Weekly chart not yet initialized");
    }

    console.log("✅ Charts updated successfully");
  } catch (error) {
    console.error("❌ Error updating charts:", error);
  }
}

// Get weekly completion data (last 7 days)
function getWeeklyCompletionData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekData = [0, 0, 0, 0, 0, 0, 0];

  tasks.forEach((task) => {
    if (task.status === "done" && !task.archived && !task.deleted) {
      // Use createdAt if updatedAt is not available
      const taskDate = task.updatedAt
        ? task.updatedAt.toDate
          ? task.updatedAt.toDate()
          : new Date(task.updatedAt)
        : task.createdAt
        ? task.createdAt.toDate
          ? task.createdAt.toDate()
          : new Date(task.createdAt)
        : new Date();

      const daysDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));

      if (daysDiff >= 0 && daysDiff < 7) {
        weekData[6 - daysDiff]++;
      }
    }
  });

  return weekData;
}

// Get monthly productivity data (last 4 weeks)
function getMonthlyProductivityData() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const monthData = [0, 0, 0, 0];

  tasks.forEach((task) => {
    if (task.status === "done" && !task.archived && !task.deleted) {
      // Use createdAt if updatedAt is not available
      const taskDate = task.updatedAt
        ? task.updatedAt.toDate
          ? task.updatedAt.toDate()
          : new Date(task.updatedAt)
        : task.createdAt
        ? task.createdAt.toDate
          ? task.createdAt.toDate()
          : new Date(task.createdAt)
        : new Date();

      const daysDiff = Math.floor((today - taskDate) / (1000 * 60 * 60 * 24));

      if (daysDiff >= 0 && daysDiff < 28) {
        const weekIndex = Math.floor(daysDiff / 7);
        if (weekIndex < 4) {
          monthData[3 - weekIndex]++;
        }
      }
    }
  });

  return monthData;
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
    // Note: modeToggle button removed, using theme selector buttons instead
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
    // Note: Theme is applied by the DOMContentLoaded listener in the theme system
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
  const selectedTheme = elements.defaultTheme.value;
  localStorage.setItem("defaultTheme", selectedTheme);
  localStorage.setItem("defaultView", elements.defaultView.value);
  localStorage.setItem("reduceMotion", elements.reduceMotion.checked);
  localStorage.setItem("disableAnimations", elements.disableAnimations.checked);

  // Apply the selected theme immediately
  applyTheme(selectedTheme);

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
  if (!modal) {
    console.error("Modal element not found");
    return;
  }
  modal.style.display = "flex";
  setTimeout(() => {
    modal.classList.add("visible");
  }, 10);
}

// Close modal
function closeModal(modal) {
  if (!modal) {
    console.error("Modal element not found");
    return;
  }
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
    // Update settings modal with current values before opening
    elements.defaultTheme.value = currentTheme;
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
document.addEventListener("DOMContentLoaded", init);

// ========== NEW FEATURES IMPLEMENTATION ==========

// Theme System
// Check for defaultTheme from settings first, then fall back to appTheme
let currentTheme =
  localStorage.getItem("defaultTheme") ||
  localStorage.getItem("appTheme") ||
  "dark";
let currentLayout = localStorage.getItem("appLayout") || "kanban";
let currentDensity = localStorage.getItem("appDensity") || "relaxed";
let bulkSelectMode = false;
let selectedTasks = new Set();
let advancedFilters = {
  dateFrom: null,
  dateTo: null,
  statuses: [],
  difficulties: [],
  importances: [],
};

// Apply theme on load
function applyTheme(theme) {
  const body = document.body;
  body.classList.remove(
    "light-mode",
    "dark-mode",
    "blue-theme",
    "green-theme",
    "pink-theme",
    "orange-theme"
  );

  if (theme === "light") {
    body.classList.add("light-mode");
  } else if (theme === "dark") {
    body.classList.add("dark-mode");
  } else {
    body.classList.add(theme + "-theme", "dark-mode");
  }

  currentTheme = theme;
  localStorage.setItem("appTheme", theme);
  // Also update defaultTheme to keep settings in sync
  localStorage.setItem("defaultTheme", theme);

  // Update active theme button
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.theme === theme);
  });
}

// Theme button event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".theme-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyTheme(btn.dataset.theme);
      showNotification(
        `${
          btn.dataset.theme.charAt(0).toUpperCase() + btn.dataset.theme.slice(1)
        } theme applied!`,
        "success"
      );
    });
  });

  // Apply saved theme
  applyTheme(currentTheme);
});

// Layout System
function switchLayout(layout) {
  // Hide all views
  document.getElementById("kanban-view").style.display = "none";
  document.getElementById("list-view").style.display = "none";
  document.getElementById("grid-view").style.display = "none";
  document.getElementById("timeline-view").style.display = "none";
  document.getElementById("calendar-view").style.display = "none";

  // Show selected view
  if (layout === "kanban") {
    document.getElementById("kanban-view").style.display = "grid";
    renderTasks();
  } else if (layout === "list") {
    document.getElementById("list-view").style.display = "block";
    renderListView();
  } else if (layout === "grid") {
    document.getElementById("grid-view").style.display = "block";
    renderGridView();
  } else if (layout === "timeline") {
    document.getElementById("timeline-view").style.display = "block";
    renderTimelineView();
  }

  currentLayout = layout;
  localStorage.setItem("appLayout", layout);

  // Update active layout button
  document.querySelectorAll(".layout-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.layout === layout);
  });
}

// Layout button event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".layout-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      switchLayout(btn.dataset.layout);
    });
  });

  // Apply saved layout
  switchLayout(currentLayout);
});

// Density System
function applyDensity(density) {
  document.body.classList.remove("compact-mode", "relaxed-mode");
  document.body.classList.add(density + "-mode");

  currentDensity = density;
  localStorage.setItem("appDensity", density);

  // Update active density button
  document.querySelectorAll(".density-btn").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.density === density);
  });
}

// Density button event listeners
document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".density-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      applyDensity(btn.dataset.density);
      showNotification(
        `${
          btn.dataset.density.charAt(0).toUpperCase() +
          btn.dataset.density.slice(1)
        } mode applied!`,
        "success"
      );
    });
  });

  // Apply saved density
  applyDensity(currentDensity);
});

// List View Rendering
function renderListView() {
  const container = document.getElementById("list-container");
  container.innerHTML = "";

  const activeTasks = tasks.filter((task) => !task.archived && !task.deleted);

  if (activeTasks.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-list"></i><p>No tasks found</p></div>';
    return;
  }

  activeTasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "list-task-item";

    const priorityClass =
      task.importance === 3
        ? "task-card-priority-high"
        : task.importance === 2
        ? "task-card-priority-medium"
        : "task-card-priority-low";
    item.classList.add(priorityClass);

    item.innerHTML = `
      <input type="checkbox" class="list-task-checkbox" ${
        task.status === "done" ? "checked" : ""
      }>
      <div class="list-task-content">
        <div class="list-task-title">${task.title}</div>
        <div class="list-task-meta">
          <span class="task-difficulty ${task.difficulty}">${
      task.difficulty
    }</span>
          <span class="task-date">${task.dueDate || "No due date"}</span>
          <span class="task-importance" data-importance="${task.importance}">${
      task.importance
    }</span>
        </div>
      </div>
    `;

    item
      .querySelector(".list-task-checkbox")
      .addEventListener("change", (e) => {
        updateTaskStatus(task.id, e.target.checked ? "done" : "todo");
      });

    item.addEventListener("click", (e) => {
      if (e.target.type !== "checkbox") {
        editTask(task.id);
      }
    });

    container.appendChild(item);
  });
}

// Grid View Rendering
function renderGridView() {
  const container = document.getElementById("grid-container");
  container.innerHTML = "";

  const activeTasks = tasks.filter((task) => !task.archived && !task.deleted);

  if (activeTasks.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-th"></i><p>No tasks found</p></div>';
    return;
  }

  activeTasks.forEach((task) => {
    const card = createTaskElement(task);
    card.classList.add("grid-task-card");
    container.appendChild(card);
  });
}

// Timeline View Rendering
function renderTimelineView() {
  const container = document.getElementById("timeline-container");
  container.innerHTML = "";

  const activeTasks = tasks.filter(
    (task) => !task.archived && !task.deleted && task.dueDate
  );

  if (activeTasks.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-stream"></i><p>No tasks with due dates found</p></div>';
    return;
  }

  // Sort by due date
  activeTasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));

  activeTasks.forEach((task) => {
    const item = document.createElement("div");
    item.className = "timeline-item";

    item.innerHTML = `
      <div class="timeline-date">${new Date(task.dueDate).toLocaleDateString(
        "en-US",
        { weekday: "long", year: "numeric", month: "long", day: "numeric" }
      )}</div>
      <h3 class="task-title">${task.title}</h3>
      <p class="task-description">${task.description || "No description"}</p>
      <div class="task-meta">
        <span class="task-difficulty ${task.difficulty}">${
      task.difficulty
    }</span>
        <span class="task-importance" data-importance="${task.importance}">${
      task.importance
    }</span>
      </div>
    `;

    item.addEventListener("click", () => editTask(task.id));
    container.appendChild(item);
  });
}

// Advanced Search/Filter
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("toggle-advanced-search");
  const content = document.getElementById("advanced-search-content");
  const applyBtn = document.getElementById("apply-filters");
  const clearBtn = document.getElementById("clear-filters");

  if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
      const isHidden = content.style.display === "none";
      content.style.display = isHidden ? "block" : "none";
      toggleBtn.innerHTML = isHidden
        ? '<i class="fas fa-filter"></i>Hide Filters'
        : '<i class="fas fa-filter"></i>Advanced Filters';
    });
  }

  if (applyBtn) {
    applyBtn.addEventListener("click", () => {
      advancedFilters.dateFrom =
        document.getElementById("filter-date-from").value;
      advancedFilters.dateTo = document.getElementById("filter-date-to").value;
      advancedFilters.statuses = Array.from(
        document.getElementById("filter-status").selectedOptions
      ).map((o) => o.value);
      advancedFilters.difficulties = Array.from(
        document.getElementById("filter-difficulty").selectedOptions
      ).map((o) => o.value);
      advancedFilters.importances = Array.from(
        document.getElementById("filter-importance").selectedOptions
      ).map((o) => o.value);

      applyAdvancedFilters();
      showNotification("Filters applied!", "success");
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      document.getElementById("filter-date-from").value = "";
      document.getElementById("filter-date-to").value = "";
      document.getElementById("filter-status").selectedIndex = -1;
      document.getElementById("filter-difficulty").selectedIndex = -1;
      document.getElementById("filter-importance").selectedIndex = -1;

      advancedFilters = {
        dateFrom: null,
        dateTo: null,
        statuses: [],
        difficulties: [],
        importances: [],
      };
      filterAndRenderTasks();
      showNotification("Filters cleared!", "info");
    });
  }
});

function applyAdvancedFilters() {
  let filteredTasks = [...tasks].filter(
    (task) => !task.archived && !task.deleted
  );

  // Date range filter
  if (advancedFilters.dateFrom) {
    filteredTasks = filteredTasks.filter(
      (task) => task.dueDate >= advancedFilters.dateFrom
    );
  }
  if (advancedFilters.dateTo) {
    filteredTasks = filteredTasks.filter(
      (task) => task.dueDate <= advancedFilters.dateTo
    );
  }

  // Status filter
  if (advancedFilters.statuses.length > 0) {
    filteredTasks = filteredTasks.filter((task) =>
      advancedFilters.statuses.includes(task.status)
    );
  }

  // Difficulty filter
  if (advancedFilters.difficulties.length > 0) {
    filteredTasks = filteredTasks.filter((task) =>
      advancedFilters.difficulties.includes(task.difficulty)
    );
  }

  // Importance filter
  if (advancedFilters.importances.length > 0) {
    filteredTasks = filteredTasks.filter((task) =>
      advancedFilters.importances.includes(String(task.importance))
    );
  }

  renderTasks(filteredTasks);
}

// Bulk Selection System
document.addEventListener("DOMContentLoaded", () => {
  const bulkToggleBtn = document.getElementById("bulk-select-toggle");
  const bulkActionsBtn = document.getElementById("bulk-actions-btn");

  if (bulkToggleBtn) {
    bulkToggleBtn.addEventListener("click", () => {
      bulkSelectMode = !bulkSelectMode;
      selectedTasks.clear();

      if (bulkSelectMode) {
        bulkToggleBtn.innerHTML = '<i class="fas fa-times"></i>Cancel';
        bulkActionsBtn.style.display = "flex";
        document.querySelectorAll(".task-card").forEach((card) => {
          card.classList.add("bulk-select-mode");
          card.addEventListener("click", handleBulkSelect);
        });
      } else {
        bulkToggleBtn.innerHTML =
          '<i class="fas fa-check-square"></i>Bulk Select';
        bulkActionsBtn.style.display = "none";
        document.querySelectorAll(".task-card").forEach((card) => {
          card.classList.remove("bulk-select-mode", "selected");
          card.removeEventListener("click", handleBulkSelect);
        });
      }
    });
  }

  if (bulkActionsBtn) {
    bulkActionsBtn.addEventListener("click", () => {
      if (selectedTasks.size > 0) {
        openModal(document.getElementById("bulk-actions-modal"));
        document.getElementById("selected-count").textContent =
          selectedTasks.size;
      } else {
        showNotification("No tasks selected", "warning");
      }
    });
  }
});

function handleBulkSelect(e) {
  e.stopPropagation();
  const taskId = this.dataset.id;

  if (selectedTasks.has(taskId)) {
    selectedTasks.delete(taskId);
    this.classList.remove("selected");
  } else {
    selectedTasks.add(taskId);
    this.classList.add("selected");
  }
}

// Bulk Actions
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("bulk-complete")?.addEventListener("click", () => {
    selectedTasks.forEach((taskId) => updateTaskStatus(taskId, "done"));
    showNotification(
      `${selectedTasks.size} tasks marked as complete`,
      "success"
    );
    closeModal(document.getElementById("bulk-actions-modal"));
    selectedTasks.clear();
  });

  document.getElementById("bulk-archive")?.addEventListener("click", () => {
    selectedTasks.forEach((taskId) => archiveTaskById(taskId));
    showNotification(`${selectedTasks.size} tasks archived`, "success");
    closeModal(document.getElementById("bulk-actions-modal"));
    selectedTasks.clear();
  });

  document.getElementById("bulk-delete")?.addEventListener("click", () => {
    showConfirmation(
      "Delete Tasks",
      `Are you sure you want to delete ${selectedTasks.size} tasks?`,
      () => {
        selectedTasks.forEach((taskId) => moveToTrash(taskId));
        showNotification(
          `${selectedTasks.size} tasks moved to trash`,
          "success"
        );
        closeModal(document.getElementById("bulk-actions-modal"));
        selectedTasks.clear();
      }
    );
  });

  document.getElementById("close-bulk-modal")?.addEventListener("click", () => {
    closeModal(document.getElementById("bulk-actions-modal"));
  });
});

function archiveTaskById(taskId) {
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        archived: true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  } else {
    const task = tasks.find((t) => t.id === taskId);
    if (task) task.archived = true;
    saveTasksToLocalStorage();
    renderTasks();
  }
}

// Trash System
function moveToTrash(taskId) {
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        deleted: true,
        deletedAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  } else {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.deleted = true;
      task.deletedAt = new Date().toISOString();
    }
    saveTasksToLocalStorage();
    renderTasks();
  }
}

function restoreFromTrash(taskId) {
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        deleted: false,
        deletedAt: null,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      });
  } else {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.deleted = false;
      task.deletedAt = null;
    }
    saveTasksToLocalStorage();
    renderTasks();
  }
  showNotification("Task restored!", "success");
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("show-trash")?.addEventListener("click", showTrash);
  document
    .getElementById("close-trash-modal")
    ?.addEventListener("click", () => {
      closeModal(document.getElementById("trash-modal-overlay"));
    });
  document.getElementById("empty-trash")?.addEventListener("click", emptyTrash);
});

function showTrash() {
  const trashedTasks = tasks.filter((task) => task.deleted);
  const container = document.getElementById("trash-tasks-list");
  container.innerHTML = "";

  if (trashedTasks.length === 0) {
    container.innerHTML =
      '<div class="empty-state"><i class="fas fa-trash-alt"></i><p>Trash is empty</p></div>';
  } else {
    trashedTasks.forEach((task) => {
      const taskElement = document.createElement("div");
      taskElement.className = "task-card";
      taskElement.innerHTML = `
        <h3 class="task-title">${task.title}</h3>
        <p class="task-description">${task.description || "No description"}</p>
        <div class="task-actions">
          <button class="btn-success restore-btn" data-id="${task.id}">
            <i class="fas fa-undo"></i>Restore
          </button>
          <button class="btn-danger delete-permanent-btn" data-id="${task.id}">
            <i class="fas fa-trash"></i>Delete Forever
          </button>
        </div>
      `;

      taskElement
        .querySelector(".restore-btn")
        .addEventListener("click", () => {
          restoreFromTrash(task.id);
          showTrash();
        });

      taskElement
        .querySelector(".delete-permanent-btn")
        .addEventListener("click", () => {
          showConfirmation(
            "Delete Forever",
            "This action cannot be undone!",
            () => {
              permanentlyDeleteTask(task.id);
              showTrash();
            }
          );
        });

      container.appendChild(taskElement);
    });
  }

  openModal(document.getElementById("trash-modal-overlay"));
}

function emptyTrash() {
  showConfirmation(
    "Empty Trash",
    "Permanently delete all tasks in trash? This cannot be undone!",
    () => {
      const trashedTasks = tasks.filter((task) => task.deleted);
      trashedTasks.forEach((task) => permanentlyDeleteTask(task.id));
      showNotification("Trash emptied", "success");
      closeModal(document.getElementById("trash-modal-overlay"));
    }
  );
}

function permanentlyDeleteTask(taskId) {
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .delete();
  } else {
    tasks = tasks.filter((t) => t.id !== taskId);
    saveTasksToLocalStorage();
    renderTasks();
  }
}

// Onboarding System
let onboardingStep = 1;
const totalOnboardingSteps = 5;

document.addEventListener("DOMContentLoaded", () => {
  // Check if user has seen onboarding
  const hasSeenOnboarding = localStorage.getItem("hasSeenOnboarding");
  if (!hasSeenOnboarding) {
    setTimeout(() => {
      openModal(document.getElementById("onboarding-modal"));
    }, 1000);
  }

  document
    .getElementById("onboarding-next")
    ?.addEventListener("click", nextOnboardingStep);
  document
    .getElementById("onboarding-prev")
    ?.addEventListener("click", prevOnboardingStep);
  document
    .getElementById("onboarding-finish")
    ?.addEventListener("click", finishOnboarding);
  document
    .getElementById("close-onboarding")
    ?.addEventListener("click", finishOnboarding);
});

function nextOnboardingStep() {
  if (onboardingStep < totalOnboardingSteps) {
    onboardingStep++;
    updateOnboardingStep();
  }
}

function prevOnboardingStep() {
  if (onboardingStep > 1) {
    onboardingStep--;
    updateOnboardingStep();
  }
}

function updateOnboardingStep() {
  document.querySelectorAll(".onboarding-step").forEach((step, index) => {
    step.classList.toggle("active", index + 1 === onboardingStep);
  });

  document.querySelectorAll(".dot").forEach((dot, index) => {
    dot.classList.toggle("active", index + 1 === onboardingStep);
  });

  document.getElementById("onboarding-prev").style.display =
    onboardingStep === 1 ? "none" : "flex";
  document.getElementById("onboarding-next").style.display =
    onboardingStep === totalOnboardingSteps ? "none" : "flex";
  document.getElementById("onboarding-finish").style.display =
    onboardingStep === totalOnboardingSteps ? "flex" : "none";
}

function finishOnboarding() {
  localStorage.setItem("hasSeenOnboarding", "true");
  closeModal(document.getElementById("onboarding-modal"));
  onboardingStep = 1;
  updateOnboardingStep();
}

// Confirmation Dialog
function showConfirmation(title, message, onConfirm) {
  const dialog = document.getElementById("confirmation-dialog");
  document.getElementById("confirmation-title").textContent = title;
  document.getElementById("confirmation-message").textContent = message;

  const confirmBtn = document.getElementById("confirmation-confirm");
  const cancelBtn = document.getElementById("confirmation-cancel");

  const handleConfirm = () => {
    onConfirm();
    closeModal(dialog);
    confirmBtn.removeEventListener("click", handleConfirm);
  };

  const handleCancel = () => {
    closeModal(dialog);
    confirmBtn.removeEventListener("click", handleConfirm);
  };

  confirmBtn.addEventListener("click", handleConfirm);
  cancelBtn.addEventListener("click", handleCancel);

  openModal(dialog);
}

// Analytics Collapse
document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("collapse-analytics")
    ?.addEventListener("click", function () {
      const content = document.getElementById("charts-content");
      const isCollapsed = content.classList.contains("collapsed");

      content.classList.toggle("collapsed");
      this.classList.toggle("collapsed");
      this.querySelector("i").className = isCollapsed
        ? "fas fa-chevron-up"
        : "fas fa-chevron-down";
    });
});

// Smart Reminders (Basic Implementation)
function checkSmartReminders() {
  const now = new Date();
  const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

  tasks.forEach((task) => {
    if (!task.archived && !task.deleted && task.status !== "done") {
      const lastUpdated = task.updatedAt
        ? new Date(task.updatedAt)
        : new Date(task.createdAt);

      if (lastUpdated < threeDaysAgo) {
        showNotification(
          `Reminder: You haven't worked on "${task.title}" in 3 days!`,
          "warning"
        );
      }
    }
  });
}

// Run smart reminders check periodically
setInterval(checkSmartReminders, 60 * 60 * 1000); // Check every hour

// Sentiment Detection (Basic Implementation)
function detectUrgency(description) {
  const urgentKeywords = [
    "urgent",
    "asap",
    "immediately",
    "critical",
    "emergency",
    "important",
    "priority",
  ];
  const lowerDesc = description.toLowerCase();

  for (const keyword of urgentKeywords) {
    if (lowerDesc.includes(keyword)) {
      return 3; // High importance
    }
  }

  return 1; // Default to low
}

// Auto-adjust importance based on description
document
  .getElementById("task-description")
  ?.addEventListener("blur", function () {
    const description = this.value;
    if (description) {
      const detectedImportance = detectUrgency(description);
      if (detectedImportance === 3) {
        document.querySelectorAll(".importance-option").forEach((opt) => {
          opt.classList.toggle("selected", opt.dataset.importance === "3");
        });
        showNotification("High importance detected from description!", "info");
      }
    }
  });

console.log("All new features initialized successfully!");

// ========== CUSTOM TAGS SYSTEM ==========
let customTags = JSON.parse(localStorage.getItem("customTags")) || [
  { name: "Work", color: "#0984e3" },
  { name: "Personal", color: "#00b894" },
  { name: "Urgent", color: "#d63031" },
];

// Save custom tags to localStorage
function saveCustomTags() {
  localStorage.setItem("customTags", JSON.stringify(customTags));
  updateTagsFilter();
  updateTaskTagsOptions();
}

// Update tags filter dropdown
function updateTagsFilter() {
  const tagsFilter = document.getElementById("tags-filter");
  if (!tagsFilter) return;

  tagsFilter.innerHTML = '<option value="all">All Tags</option>';
  customTags.forEach((tag) => {
    const option = document.createElement("option");
    option.value = tag.name;
    option.textContent = tag.name;
    tagsFilter.appendChild(option);
  });
}

// Update task tags options in forms
function updateTaskTagsOptions() {
  const taskTagsSelects = [
    document.getElementById("task-tags"),
    document.getElementById("modal-task-tags"),
  ];

  taskTagsSelects.forEach((select) => {
    if (!select) return;
    const selectedValues = Array.from(select.selectedOptions).map(
      (o) => o.value
    );
    select.innerHTML = "";

    customTags.forEach((tag) => {
      const option = document.createElement("option");
      option.value = tag.name;
      option.textContent = tag.name;
      option.style.backgroundColor = tag.color;
      option.style.color = "white";
      if (selectedValues.includes(tag.name)) {
        option.selected = true;
      }
      select.appendChild(option);
    });
  });
}

// Show tags management modal
function showTagsManager() {
  const tagsList = document.getElementById("tags-list");
  tagsList.innerHTML = "";

  if (customTags.length === 0) {
    tagsList.innerHTML =
      '<p style="color: var(--muted); text-align: center;">No tags yet. Add one below!</p>';
  } else {
    customTags.forEach((tag, index) => {
      const tagItem = document.createElement("div");
      tagItem.className = "tag-item";
      tagItem.style.backgroundColor = tag.color;
      tagItem.innerHTML = `
        <span>${tag.name}</span>
        <button class="delete-tag" data-index="${index}">
          <i class="fas fa-times"></i>
        </button>
      `;

      tagItem.querySelector(".delete-tag").addEventListener("click", (e) => {
        e.stopPropagation();
        deleteTag(index);
      });

      tagsList.appendChild(tagItem);
    });
  }

  openModal(document.getElementById("tags-modal-overlay"));
}

// Add new tag
function addTag() {
  const nameInput = document.getElementById("new-tag-name");
  const colorInput = document.getElementById("new-tag-color");

  const name = nameInput.value.trim();
  const color = colorInput.value;

  if (!name) {
    showNotification("Tag name is required", "error");
    return;
  }

  // Check if tag already exists
  if (customTags.some((tag) => tag.name.toLowerCase() === name.toLowerCase())) {
    showNotification("Tag already exists", "error");
    return;
  }

  customTags.push({ name, color });
  saveCustomTags();

  nameInput.value = "";
  colorInput.value = "#6c5ce7";

  showTagsManager();
  showNotification(`Tag "${name}" added!`, "success");
}

// Delete tag
function deleteTag(index) {
  const tag = customTags[index];
  showConfirmation("Delete Tag", `Delete "${tag.name}" tag?`, () => {
    customTags.splice(index, 1);
    saveCustomTags();
    showTagsManager();
    showNotification(`Tag "${tag.name}" deleted`, "success");
  });
}

// Initialize tags system
document.addEventListener("DOMContentLoaded", () => {
  updateTagsFilter();
  updateTaskTagsOptions();

  document
    .getElementById("manage-tags-btn")
    ?.addEventListener("click", showTagsManager);
  document.getElementById("close-tags-modal")?.addEventListener("click", () => {
    closeModal(document.getElementById("tags-modal-overlay"));
  });
  document.getElementById("add-tag-btn")?.addEventListener("click", addTag);

  // Allow Enter key to add tag
  document.getElementById("new-tag-name")?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      addTag();
    }
  });
});

// Enhanced task card rendering with custom tag colors
const originalCreateTaskElement = createTaskElement;
createTaskElement = function (task) {
  const taskElement = originalCreateTaskElement(task);

  // Add priority border
  if (task.importance === 3) {
    taskElement.classList.add("task-card-priority-high");
  } else if (task.importance === 2) {
    taskElement.classList.add("task-card-priority-medium");
  } else {
    taskElement.classList.add("task-card-priority-low");
  }

  // Update tag colors
  const tagsContainer = taskElement.querySelector(".task-tags");
  if (tagsContainer && task.tags) {
    tagsContainer.innerHTML = "";
    task.tags.forEach((tagName) => {
      const tagConfig = customTags.find((t) => t.name === tagName);
      const tagElement = document.createElement("span");
      tagElement.className = "task-tag";
      tagElement.textContent = tagName;
      if (tagConfig) {
        tagElement.style.backgroundColor = tagConfig.color;
      }
      tagsContainer.appendChild(tagElement);
    });
  }

  // Add task icons
  const metaDiv = taskElement.querySelector(".task-meta");
  if (metaDiv) {
    const iconsDiv = document.createElement("div");
    iconsDiv.className = "task-icons";

    // Difficulty icon
    const difficultyIcon = document.createElement("div");
    difficultyIcon.className = "task-icon icon-difficulty";
    difficultyIcon.title = `Difficulty: ${task.difficulty}`;
    difficultyIcon.innerHTML =
      task.difficulty === "hard"
        ? '<i class="fas fa-fire"></i>'
        : task.difficulty === "medium"
        ? '<i class="fas fa-bolt"></i>'
        : '<i class="fas fa-leaf"></i>';
    iconsDiv.appendChild(difficultyIcon);

    // Importance icon
    const importanceIcon = document.createElement("div");
    importanceIcon.className = "task-icon icon-importance";
    importanceIcon.title = `Importance: ${task.importance}`;
    importanceIcon.innerHTML = '<i class="fas fa-exclamation"></i>';
    iconsDiv.appendChild(importanceIcon);

    // Overdue icon
    if (
      task.dueDate &&
      new Date(task.dueDate) < new Date() &&
      task.status !== "done"
    ) {
      const overdueIcon = document.createElement("div");
      overdueIcon.className = "task-icon icon-overdue";
      overdueIcon.title = "Overdue!";
      overdueIcon.innerHTML = '<i class="fas fa-clock"></i>';
      iconsDiv.appendChild(overdueIcon);
    }

    metaDiv.appendChild(iconsDiv);
  }

  return taskElement;
};

// Error validation for task form
document.addEventListener("DOMContentLoaded", () => {
  const taskForm = document.querySelector(".task-form");
  const startTimeInput = document.getElementById("task-start-time");
  const endTimeInput = document.getElementById("task-end-time");
  const dueDateInput = document.getElementById("task-due-date");

  // Validate time range
  function validateTimeRange() {
    if (startTimeInput.value && endTimeInput.value) {
      const start = new Date(`2000-01-01T${startTimeInput.value}`);
      const end = new Date(`2000-01-01T${endTimeInput.value}`);

      if (end <= start) {
        showNotification("End time must be after start time", "error");
        endTimeInput.value = "";
        return false;
      }
    }
    return true;
  }

  startTimeInput?.addEventListener("change", validateTimeRange);
  endTimeInput?.addEventListener("change", validateTimeRange);

  // Validate due date (warn if in the past)
  dueDateInput?.addEventListener("change", function () {
    const selectedDate = new Date(this.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
      showNotification("Due date is in the past", "warning");
    }
  });
});

// Add keyboard shortcut hints
document.addEventListener("DOMContentLoaded", () => {
  // Show keyboard shortcuts on Ctrl+?
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "/") {
      e.preventDefault();
      showNotification(
        "Shortcuts: Ctrl+N (New Task), Ctrl+F (Search), Ctrl+, (Settings), Esc (Close)",
        "info"
      );
    }
  });
});

console.log("Custom tags system and enhancements initialized!");

// ========== HELP MODAL TABS ==========
document.addEventListener("DOMContentLoaded", () => {
  const helpTabs = document.querySelectorAll(".help-tab");
  const helpTabContents = document.querySelectorAll(".help-tab-content");

  helpTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      const targetTab = tab.dataset.tab;

      // Remove active class from all tabs and contents
      helpTabs.forEach((t) => t.classList.remove("active"));
      helpTabContents.forEach((content) => content.classList.remove("active"));

      // Add active class to clicked tab and corresponding content
      tab.classList.add("active");
      document.getElementById(targetTab)?.classList.add("active");
    });
  });
});

console.log("Help modal tabs initialized!");

// ========== ADDITIONAL FIXES AND ENHANCEMENTS ==========

// Global settings object
let appSettings = {
  reduceNotifications: false,
  disableNotifications: false,
  reduceMotion: false,
  disableAnimations: false,
  defaultView: "kanban",
  defaultTheme: "dark",
};

// Load app settings on init
function loadAppSettings() {
  const savedSettings = localStorage.getItem("appSettings");
  if (savedSettings) {
    appSettings = JSON.parse(savedSettings);
  }

  // Apply settings
  if (appSettings.reduceMotion) {
    document.body.style.setProperty("--transition", "none");
  }
  if (appSettings.disableAnimations) {
    document.body.classList.add("no-animations");
  }

  // Load notification settings
  const reduceNotifCheckbox = document.getElementById("reduce-notifications");
  const disableNotifCheckbox = document.getElementById("disable-notifications");
  if (reduceNotifCheckbox)
    reduceNotifCheckbox.checked = appSettings.reduceNotifications;
  if (disableNotifCheckbox)
    disableNotifCheckbox.checked = appSettings.disableNotifications;
}

// Enhanced save settings function
function saveSettingsEnhanced() {
  const defaultTheme =
    document.getElementById("default-theme")?.value || "dark";
  const defaultView =
    document.getElementById("default-view")?.value || "kanban";
  const reduceMotion =
    document.getElementById("reduce-motion")?.checked || false;
  const disableAnimations =
    document.getElementById("disable-animations")?.checked || false;
  const reduceNotifications =
    document.getElementById("reduce-notifications")?.checked || false;
  const disableNotifications =
    document.getElementById("disable-notifications")?.checked || false;

  appSettings = {
    defaultTheme,
    defaultView,
    reduceMotion,
    disableAnimations,
    reduceNotifications,
    disableNotifications,
  };

  // Save to localStorage
  localStorage.setItem("appSettings", JSON.stringify(appSettings));
  localStorage.setItem("defaultTheme", defaultTheme);
  localStorage.setItem("defaultView", defaultView);
  localStorage.setItem("reduceMotion", reduceMotion);
  localStorage.setItem("disableAnimations", disableAnimations);

  // Apply theme immediately
  applyThemeEnhanced(defaultTheme);

  // Apply view immediately
  applyDefaultView(defaultView);

  // Apply animation settings
  if (reduceMotion) {
    document.body.style.setProperty("--transition", "all 0.1s ease");
  } else {
    document.body.style.setProperty(
      "--transition",
      "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)"
    );
  }

  if (disableAnimations) {
    document.body.classList.add("no-animations");
    const style = document.createElement("style");
    style.id = "no-animations-style";
    style.textContent =
      "* { animation: none !important; transition: none !important; }";
    document.head.appendChild(style);
  } else {
    document.body.classList.remove("no-animations");
    const existingStyle = document.getElementById("no-animations-style");
    if (existingStyle) existingStyle.remove();
  }

  // Save to Firestore if user is logged in
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .set(
        {
          settings: appSettings,
        },
        { merge: true }
      )
      .catch((err) => console.error("Error saving settings:", err));
  }

  showNotificationEnhanced("Settings saved successfully!", "success");
  closeModal(document.getElementById("settings-modal-overlay"));
}

// Apply theme function
function applyThemeEnhanced(theme) {
  const body = document.body;
  body.classList.remove(
    "light-mode",
    "dark-mode",
    "blue-theme",
    "green-theme",
    "pink-theme",
    "orange-theme"
  );

  if (theme === "light") {
    body.classList.add("light-mode");
  } else if (theme === "dark") {
    body.classList.add("dark-mode");
  } else {
    body.classList.add(theme + "-theme");
  }

  localStorage.setItem("theme", theme);
}

// Apply default view
function applyDefaultView(view) {
  const kanbanView = document.getElementById("kanban-view");
  const calendarView = document.getElementById("calendar-view");
  const viewToggle = document.getElementById("view-toggle");

  if (view === "calendar") {
    if (kanbanView) kanbanView.style.display = "none";
    if (calendarView) calendarView.style.display = "block";
    if (viewToggle)
      viewToggle.innerHTML = '<i class="fas fa-columns"></i>Kanban View';
    currentView = "calendar";
  } else {
    if (kanbanView) kanbanView.style.display = "grid";
    if (calendarView) calendarView.style.display = "none";
    if (viewToggle)
      viewToggle.innerHTML = '<i class="fas fa-calendar"></i>Calendar View';
    currentView = "kanban";
  }

  localStorage.setItem("view", view);
}

// Enhanced notification function with settings
function showNotificationEnhanced(message, type = "info", isImportant = false) {
  // Check notification settings
  if (appSettings.disableNotifications) return;
  if (appSettings.reduceNotifications && !isImportant) return;

  const notification = document.getElementById("notification");
  const notificationIcon = document.getElementById("notification-icon");
  const notificationMessage = document.getElementById("notification-message");

  if (!notification || !notificationIcon || !notificationMessage) return;

  notificationMessage.textContent = message;

  // Set icon based on type
  switch (type) {
    case "success":
      notificationIcon.className = "fas fa-check-circle";
      notification.style.borderLeft = "4px solid var(--success)";
      break;
    case "error":
      notificationIcon.className = "fas fa-exclamation-circle";
      notification.style.borderLeft = "4px solid var(--danger)";
      break;
    case "warning":
      notificationIcon.className = "fas fa-exclamation-triangle";
      notification.style.borderLeft = "4px solid var(--warning)";
      break;
    default:
      notificationIcon.className = "fas fa-info-circle";
      notification.style.borderLeft = "4px solid var(--info)";
  }

  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 5000);
}

// Profile picture handling
function setupProfilePicture() {
  const profilePicture = document.getElementById("profile-picture");
  const profilePictureUpload = document.getElementById(
    "profile-picture-upload"
  );
  const changeProfilePictureBtn = document.getElementById(
    "change-profile-picture-btn"
  );

  if (changeProfilePictureBtn && profilePictureUpload) {
    changeProfilePictureBtn.addEventListener("click", () => {
      profilePictureUpload.click();
    });
  }

  if (profilePictureUpload && profilePicture) {
    profilePictureUpload.addEventListener("change", (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          profilePicture.src = event.target.result;

          // Save to localStorage
          localStorage.setItem("profilePicture", event.target.result);

          // Save to Firestore if logged in
          if (currentUser) {
            db.collection("users")
              .doc(currentUser.uid)
              .set(
                {
                  profilePicture: event.target.result,
                },
                { merge: true }
              )
              .then(() => {
                showNotificationEnhanced(
                  "Profile picture updated!",
                  "success",
                  true
                );
              })
              .catch((err) => {
                console.error("Error updating profile picture:", err);
                showNotificationEnhanced(
                  "Error updating profile picture",
                  "error",
                  true
                );
              });
          } else {
            showNotificationEnhanced(
              "Profile picture updated!",
              "success",
              true
            );
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  // Load saved profile picture
  const savedPicture = localStorage.getItem("profilePicture");
  if (savedPicture && profilePicture) {
    profilePicture.src = savedPicture;
  }

  // Load from Google if signed in with Google
  if (currentUser && currentUser.photoURL && profilePicture) {
    profilePicture.src = currentUser.photoURL;
  }
}

// Enhanced modal open/close with proper centering
function openModalEnhanced(modal) {
  if (!modal) return;
  modal.classList.add("show");
  modal.style.display = "flex";
}

function closeModalEnhanced(modal) {
  if (!modal) return;
  modal.classList.remove("show");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Fix bulk actions
function setupBulkActions() {
  const bulkSelectToggle = document.getElementById("bulk-select-toggle");
  const bulkActionsBtn = document.getElementById("bulk-actions-btn");
  const bulkActionsModal = document.getElementById("bulk-actions-modal");
  const closeBulkModal = document.getElementById("close-bulk-modal");

  let bulkSelectMode = false;
  let selectedTasks = new Set();

  if (bulkSelectToggle) {
    bulkSelectToggle.addEventListener("click", () => {
      bulkSelectMode = !bulkSelectMode;

      if (bulkSelectMode) {
        bulkSelectToggle.innerHTML = '<i class="fas fa-times"></i>Cancel';
        bulkSelectToggle.classList.add("btn-danger");
        bulkSelectToggle.classList.remove("btn-info");
        if (bulkActionsBtn) bulkActionsBtn.style.display = "flex";

        // Add checkboxes to all task cards
        document.querySelectorAll(".task-card").forEach((card) => {
          card.classList.add("bulk-select-mode");
          card.addEventListener("click", toggleTaskSelection);
        });
      } else {
        bulkSelectToggle.innerHTML =
          '<i class="fas fa-check-square"></i>Bulk Select';
        bulkSelectToggle.classList.remove("btn-danger");
        bulkSelectToggle.classList.add("btn-info");
        if (bulkActionsBtn) bulkActionsBtn.style.display = "none";

        // Remove checkboxes
        document.querySelectorAll(".task-card").forEach((card) => {
          card.classList.remove("bulk-select-mode", "selected");
          card.removeEventListener("click", toggleTaskSelection);
        });

        selectedTasks.clear();
      }
    });
  }

  function toggleTaskSelection(e) {
    if (!bulkSelectMode) return;
    e.stopPropagation();

    const taskCard = e.currentTarget;
    const taskId = taskCard.dataset.taskId;

    if (selectedTasks.has(taskId)) {
      selectedTasks.delete(taskId);
      taskCard.classList.remove("selected");
    } else {
      selectedTasks.add(taskId);
      taskCard.classList.add("selected");
    }

    updateSelectedCount();
  }

  function updateSelectedCount() {
    const selectedCount = document.getElementById("selected-count");
    if (selectedCount) {
      selectedCount.textContent = selectedTasks.size;
    }
  }

  if (bulkActionsBtn) {
    bulkActionsBtn.addEventListener("click", () => {
      updateSelectedCount();
      openModalEnhanced(bulkActionsModal);
    });
  }

  if (closeBulkModal) {
    closeBulkModal.addEventListener("click", () => {
      closeModalEnhanced(bulkActionsModal);
    });
  }

  // Bulk complete
  const bulkComplete = document.getElementById("bulk-complete");
  if (bulkComplete) {
    bulkComplete.addEventListener("click", () => {
      selectedTasks.forEach((taskId) => {
        updateTaskStatus(taskId, "done");
      });
      showNotificationEnhanced(
        `${selectedTasks.size} tasks marked as complete`,
        "success",
        true
      );
      closeModalEnhanced(bulkActionsModal);
      selectedTasks.clear();
    });
  }

  // Bulk archive
  const bulkArchive = document.getElementById("bulk-archive");
  if (bulkArchive) {
    bulkArchive.addEventListener("click", () => {
      selectedTasks.forEach((taskId) => {
        archiveTaskById(taskId);
      });
      showNotificationEnhanced(
        `${selectedTasks.size} tasks archived`,
        "success",
        true
      );
      closeModalEnhanced(bulkActionsModal);
      selectedTasks.clear();
    });
  }

  // Bulk delete
  const bulkDelete = document.getElementById("bulk-delete");
  if (bulkDelete) {
    bulkDelete.addEventListener("click", () => {
      if (confirm(`Delete ${selectedTasks.size} tasks?`)) {
        selectedTasks.forEach((taskId) => {
          deleteTaskById(taskId);
        });
        showNotificationEnhanced(
          `${selectedTasks.size} tasks deleted`,
          "success",
          true
        );
        closeModalEnhanced(bulkActionsModal);
        selectedTasks.clear();
      }
    });
  }
}

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
      .catch((err) => console.error("Error updating task:", err));
  } else {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.status = status;
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
    }
  }
}

function archiveTaskById(taskId) {
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        archived: true,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch((err) => console.error("Error archiving task:", err));
  } else {
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.archived = true;
      saveTasksToLocalStorage();
      renderTasks();
      updateStats();
    }
  }
}

function deleteTaskById(taskId) {
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .delete()
      .catch((err) => console.error("Error deleting task:", err));
  } else {
    tasks = tasks.filter((t) => t.id !== taskId);
    saveTasksToLocalStorage();
    renderTasks();
    updateStats();
  }
}

// Request notification permission and setup reminders
function setupReminders() {
  if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission().then((permission) => {
      if (permission === "granted") {
        showNotificationEnhanced("Notifications enabled!", "success", true);
      }
    });
  }

  // Check for due reminders every minute
  setInterval(checkReminders, 60000);
}

function checkReminders() {
  if (!tasks || tasks.length === 0) return;

  const now = new Date();

  tasks.forEach((task) => {
    if (
      task.reminder &&
      task.reminder !== "none" &&
      task.dueDate &&
      !task.archived &&
      task.status !== "done"
    ) {
      const dueDate = new Date(task.dueDate);
      const reminderMinutes = parseInt(task.reminder);
      const reminderTime = new Date(
        dueDate.getTime() - reminderMinutes * 60000
      );

      // Check if it's time for reminder (within 1 minute window)
      if (
        now >= reminderTime &&
        now < new Date(reminderTime.getTime() + 60000)
      ) {
        sendNotification(task);
      }
    }
  });
}

function sendNotification(task) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification("Task Reminder", {
      body: `${task.title} is due soon!`,
      icon: "favicon.ico",
      tag: task.id,
    });
  }

  showNotificationEnhanced(`Reminder: ${task.title}`, "warning", true);
}

// ========== TASK CARD DISPLAY FIXES ==========

// Enhanced task card rendering with proper tags, importance, and difficulty display
function createTaskCardEnhanced(task) {
  const card = document.createElement("div");
  card.className = "task-card";
  card.dataset.taskId = task.id;
  card.draggable = true;

  // Add priority border
  if (task.importance === 3) {
    card.classList.add("task-card-priority-high");
  } else if (task.importance === 2) {
    card.classList.add("task-card-priority-medium");
  } else {
    card.classList.add("task-card-priority-low");
  }

  // Check if overdue
  const isOverdue =
    task.dueDate &&
    new Date(task.dueDate) < new Date() &&
    task.status !== "done";

  card.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${task.title}</h3>
      <span class="task-difficulty ${task.difficulty}">${task.difficulty}</span>
    </div>
    
    ${
      task.description
        ? `<p class="task-description">${task.description}</p>`
        : ""
    }
    
    <div class="task-meta">
      <span class="task-date">
        <i class="fas fa-calendar"></i> ${
          task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"
        }
      </span>
      <div class="task-importance" data-importance="${task.importance}">
        ${task.importance}
      </div>
    </div>
    
    ${
      task.tags && task.tags.length > 0
        ? `
      <div class="task-tags">
        ${task.tags
          .map((tag) => {
            const tagColor = getTagColor(tag);
            return `<span class="task-tag" style="background-color: ${tagColor}">${tag}</span>`;
          })
          .join("")}
      </div>
    `
        : ""
    }
    
    ${
      task.checkpoints && task.checkpoints.length > 0
        ? `
      <div class="task-progress">
        <div class="progress-bar">
          <div class="progress-fill" style="width: ${
            task.progress || 0
          }%"></div>
        </div>
        <div class="progress-text">${task.progress || 0}% Complete</div>
      </div>
    `
        : ""
    }
    
    ${
      isOverdue
        ? '<div class="task-overdue-badge"><i class="fas fa-clock"></i> Overdue</div>'
        : ""
    }
    
    <div class="task-actions">
      <button class="btn-success btn-sm" onclick="markTaskComplete('${
        task.id
      }')">
        <i class="fas fa-check"></i>
      </button>
      <button class="btn-info btn-sm" onclick="editTask('${task.id}')">
        <i class="fas fa-edit"></i>
      </button>
      <button class="btn-danger btn-sm" onclick="deleteTaskConfirm('${
        task.id
      }')">
        <i class="fas fa-trash"></i>
      </button>
    </div>
  `;

  // Add click handler to open task modal
  card.addEventListener("click", (e) => {
    if (
      !e.target.closest("button") &&
      !card.classList.contains("bulk-select-mode")
    ) {
      openTaskModal(task.id);
    }
  });

  return card;
}

// Get tag color from custom tags or default colors
function getTagColor(tagName) {
  const customTags = JSON.parse(localStorage.getItem("customTags") || "[]");
  const customTag = customTags.find((t) => t.name === tagName);

  if (customTag) {
    return customTag.color;
  }

  // Default colors for built-in tags
  const defaultColors = {
    Work: "#0984e3",
    Personal: "#00b894",
    Urgent: "#d63031",
    Important: "#fdcb6e",
    "Low Priority": "#74b9ff",
  };

  return defaultColors[tagName] || "#6c5ce7";
}

// Add CSS for overdue badge and enhanced styling
const overdueStyles = `
<style>
.task-overdue-badge {
  background-color: var(--danger);
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 0.85rem;
  margin-top: 10px;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  animation: pulse 2s ease-in-out infinite;
}

.btn-sm {
  padding: 6px 10px;
  font-size: 0.85rem;
}

.task-card-priority-high {
  border-left: 4px solid var(--danger);
}

.task-card-priority-medium {
  border-left: 4px solid var(--warning);
}

.task-card-priority-low {
  border-left: 4px solid var(--success);
}

/* Better tag styling */
.task-tag {
  padding: 6px 14px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  color: white;
  transition: var(--transition);
  display: inline-flex;
  align-items: center;
  gap: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.task-tag:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

/* Improved difficulty badges */
.task-difficulty {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  text-transform: capitalize;
}

.task-difficulty.easy {
  background-color: rgba(0, 184, 148, 0.2);
  color: var(--easy);
  border: 2px solid var(--easy);
}

.task-difficulty.medium {
  background-color: rgba(253, 203, 110, 0.2);
  color: var(--warning);
  border: 2px solid var(--warning);
}

.task-difficulty.hard {
  background-color: rgba(214, 48, 49, 0.2);
  color: var(--danger);
  border: 2px solid var(--danger);
}

/* Improved importance badge */
.task-importance {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.9rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
}

.task-importance[data-importance="1"] {
  background: linear-gradient(135deg, #74b9ff, #0984e3);
}

.task-importance[data-importance="2"] {
  background: linear-gradient(135deg, #a29bfe, #6c5ce7);
}

.task-importance[data-importance="3"] {
  background: linear-gradient(135deg, #ff7675, #d63031);
  animation: pulse 2s ease-in-out infinite;
}
</style>
`;

// Inject styles
if (!document.getElementById("task-card-enhanced-styles")) {
  const styleElement = document.createElement("div");
  styleElement.id = "task-card-enhanced-styles";
  styleElement.innerHTML = overdueStyles;
  document.head.appendChild(styleElement);
}

// Helper functions for task actions
function markTaskComplete(taskId) {
  updateTaskStatus(taskId, "done");
  showNotificationEnhanced("Task marked as complete!", "success", true);
}

function editTask(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (task) {
    currentEditingTaskId = taskId;
    openTaskModal(taskId);
  }
}

function deleteTaskConfirm(taskId) {
  if (confirm("Are you sure you want to delete this task?")) {
    deleteTaskById(taskId);
    showNotificationEnhanced("Task deleted!", "success", true);
  }
}

function openTaskModal(taskId) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task) return;

  currentEditingTaskId = taskId;

  // Populate modal fields
  const modalTaskTitle = document.getElementById("modal-task-title");
  const modalTaskDescription = document.getElementById(
    "modal-task-description"
  );
  const modalTaskDueDate = document.getElementById("modal-task-due-date");
  const modalTaskDifficulty = document.getElementById("modal-task-difficulty");
  const modalTaskTags = document.getElementById("modal-task-tags");
  const modalTaskReminder = document.getElementById("modal-task-reminder");
  const modalTaskRecurrence = document.getElementById("modal-task-recurrence");
  const modalTaskStartTime = document.getElementById("modal-task-start-time");
  const modalTaskEndTime = document.getElementById("modal-task-end-time");

  if (modalTaskTitle) modalTaskTitle.value = task.title || "";
  if (modalTaskDescription) modalTaskDescription.value = task.description || "";
  if (modalTaskDueDate) modalTaskDueDate.value = task.dueDate || "";
  if (modalTaskDifficulty)
    modalTaskDifficulty.value = task.difficulty || "easy";
  if (modalTaskReminder) modalTaskReminder.value = task.reminder || "none";
  if (modalTaskRecurrence)
    modalTaskRecurrence.value = task.recurrence || "none";
  if (modalTaskStartTime) modalTaskStartTime.value = task.startTime || "";
  if (modalTaskEndTime) modalTaskEndTime.value = task.endTime || "";

  // Set tags
  if (modalTaskTags && task.tags) {
    Array.from(modalTaskTags.options).forEach((option) => {
      option.selected = task.tags.includes(option.value);
    });
  }

  // Set importance
  const importanceOptions = document.querySelectorAll(
    "#task-modal-overlay .importance-option"
  );
  importanceOptions.forEach((option) => {
    option.classList.remove("selected");
    if (parseInt(option.dataset.importance) === task.importance) {
      option.classList.add("selected");
    }
  });

  // Populate checkpoints
  const modalCheckpoints = document.getElementById("modal-checkpoints");
  if (modalCheckpoints && task.checkpoints) {
    modalCheckpoints.innerHTML = task.checkpoints
      .map(
        (cp, index) => `
      <div class="checkpoint-item ${cp.completed ? "completed" : ""}">
        <input type="checkbox" ${cp.completed ? "checked" : ""} 
               onchange="toggleCheckpoint('${taskId}', ${index})">
        <span class="checkpoint-text">${cp.text}</span>
      </div>
    `
      )
      .join("");
  }

  // Open modal
  const taskModal = document.getElementById("task-modal-overlay");
  openModalEnhanced(taskModal);
}

function toggleCheckpoint(taskId, checkpointIndex) {
  const task = tasks.find((t) => t.id === taskId);
  if (!task || !task.checkpoints) return;

  task.checkpoints[checkpointIndex].completed =
    !task.checkpoints[checkpointIndex].completed;

  // Recalculate progress
  const completedCount = task.checkpoints.filter((cp) => cp.completed).length;
  task.progress = Math.round((completedCount / task.checkpoints.length) * 100);

  // Update in database
  if (currentUser) {
    db.collection("users")
      .doc(currentUser.uid)
      .collection("tasks")
      .doc(taskId)
      .update({
        checkpoints: task.checkpoints,
        progress: task.progress,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .catch((err) => console.error("Error updating checkpoint:", err));
  } else {
    saveTasksToLocalStorage();
    renderTasks();
    updateStats();
  }
}

// Initialize everything on DOM load
document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing enhancements...");

  // Load settings
  loadAppSettings();

  // Setup profile picture
  setupProfilePicture();

  // Setup bulk actions
  setupBulkActions();

  // Setup reminders
  setupReminders();

  // Override save settings button
  const saveSettingsBtn = document.getElementById("save-settings");
  if (saveSettingsBtn) {
    // Remove old listener and add new one
    const newSaveSettingsBtn = saveSettingsBtn.cloneNode(true);
    saveSettingsBtn.parentNode.replaceChild(
      newSaveSettingsBtn,
      saveSettingsBtn
    );
    newSaveSettingsBtn.addEventListener("click", saveSettingsEnhanced);
  }

  console.log("All enhancements initialized successfully!");
});

console.log("Task card enhancements loaded!");

// ========== CUSTOM TAGS INPUT SYSTEM ==========

// Store for all tags (common tags + user-created tags)
let allTags = ["Work", "Personal", "Urgent", "Important", "Low Priority"];
let currentTaskTags = [];
let currentModalTags = [];

// Load saved tags from localStorage
function loadSavedTags() {
  const savedTags = localStorage.getItem("allTags");
  if (savedTags) {
    allTags = JSON.parse(savedTags);
  }
}

// Save tags to localStorage
function saveTags() {
  localStorage.setItem("allTags", JSON.stringify(allTags));
}

// Setup tags input for main form
function setupTagsInput() {
  const tagsInput = document.getElementById("task-tags-input");
  const selectedTagsContainer = document.getElementById("selected-tags");
  const suggestionsContainer = document.getElementById("tags-suggestions");

  if (!tagsInput) return;

  // Show suggestions on focus
  tagsInput.addEventListener("focus", () => {
    showSuggestions(suggestionsContainer, currentTaskTags, (tag) => {
      addTag(tag, selectedTagsContainer, currentTaskTags);
      tagsInput.value = "";
      updateSuggestions(suggestionsContainer, currentTaskTags);
    });
  });

  // Filter suggestions as user types
  tagsInput.addEventListener("input", (e) => {
    const value = e.target.value.trim();
    if (value) {
      const filtered = allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !currentTaskTags.includes(tag)
      );
      showFilteredSuggestions(
        suggestionsContainer,
        filtered,
        currentTaskTags,
        (tag) => {
          addTag(tag, selectedTagsContainer, currentTaskTags);
          tagsInput.value = "";
          updateSuggestions(suggestionsContainer, currentTaskTags);
        }
      );
    } else {
      updateSuggestions(suggestionsContainer, currentTaskTags);
    }
  });

  // Add tag on Enter
  tagsInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagsInput.value.trim();
      if (value) {
        // Add to allTags if it's new
        if (!allTags.includes(value)) {
          allTags.push(value);
          saveTags();
        }
        addTag(value, selectedTagsContainer, currentTaskTags);
        tagsInput.value = "";
        updateSuggestions(suggestionsContainer, currentTaskTags);
      }
    }
  });

  // Hide suggestions when clicking outside
  document.addEventListener("click", (e) => {
    if (
      !e.target.closest(".tags-input-container") &&
      !e.target.closest(".tags-suggestions")
    ) {
      suggestionsContainer.classList.remove("show");
    }
  });
}

// Setup tags input for modal
function setupModalTagsInput() {
  const tagsInput = document.getElementById("modal-task-tags-input");
  const selectedTagsContainer = document.getElementById("modal-selected-tags");
  const suggestionsContainer = document.getElementById(
    "modal-tags-suggestions"
  );

  if (!tagsInput) return;

  // Show suggestions on focus
  tagsInput.addEventListener("focus", () => {
    showSuggestions(suggestionsContainer, currentModalTags, (tag) => {
      addTag(tag, selectedTagsContainer, currentModalTags);
      tagsInput.value = "";
      updateSuggestions(suggestionsContainer, currentModalTags);
    });
  });

  // Filter suggestions as user types
  tagsInput.addEventListener("input", (e) => {
    const value = e.target.value.trim();
    if (value) {
      const filtered = allTags.filter(
        (tag) =>
          tag.toLowerCase().includes(value.toLowerCase()) &&
          !currentModalTags.includes(tag)
      );
      showFilteredSuggestions(
        suggestionsContainer,
        filtered,
        currentModalTags,
        (tag) => {
          addTag(tag, selectedTagsContainer, currentModalTags);
          tagsInput.value = "";
          updateSuggestions(suggestionsContainer, currentModalTags);
        }
      );
    } else {
      updateSuggestions(suggestionsContainer, currentModalTags);
    }
  });

  // Add tag on Enter
  tagsInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const value = tagsInput.value.trim();
      if (value) {
        // Add to allTags if it's new
        if (!allTags.includes(value)) {
          allTags.push(value);
          saveTags();
        }
        addTag(value, selectedTagsContainer, currentModalTags);
        tagsInput.value = "";
        updateSuggestions(suggestionsContainer, currentModalTags);
      }
    }
  });
}

// Add a tag to the selected tags
function addTag(tag, container, tagsArray) {
  if (tagsArray.includes(tag)) return;

  tagsArray.push(tag);

  const tagElement = document.createElement("div");
  tagElement.className = "tag-item-input";
  tagElement.innerHTML = `
    <span>${tag}</span>
    <button class="tag-remove" type="button">×</button>
  `;

  tagElement.querySelector(".tag-remove").addEventListener("click", () => {
    const index = tagsArray.indexOf(tag);
    if (index > -1) {
      tagsArray.splice(index, 1);
    }
    tagElement.remove();
  });

  container.appendChild(tagElement);
}

// Show all suggestions
function showSuggestions(container, currentTags, onSelect) {
  container.innerHTML = "";
  const availableTags = allTags.filter((tag) => !currentTags.includes(tag));

  availableTags.forEach((tag) => {
    const suggestion = document.createElement("div");
    suggestion.className = "tag-suggestion";
    suggestion.textContent = tag;
    suggestion.addEventListener("click", () => onSelect(tag));
    container.appendChild(suggestion);
  });

  if (availableTags.length > 0) {
    container.classList.add("show");
  }
}

// Show filtered suggestions
function showFilteredSuggestions(container, filtered, currentTags, onSelect) {
  container.innerHTML = "";

  filtered.forEach((tag) => {
    const suggestion = document.createElement("div");
    suggestion.className = "tag-suggestion";
    suggestion.textContent = tag;
    suggestion.addEventListener("click", () => onSelect(tag));
    container.appendChild(suggestion);
  });

  if (filtered.length > 0) {
    container.classList.add("show");
  } else {
    container.classList.remove("show");
  }
}

// Update suggestions
function updateSuggestions(container, currentTags) {
  const availableTags = allTags.filter((tag) => !currentTags.includes(tag));
  if (availableTags.length === 0) {
    container.classList.remove("show");
  }
}

// Get current tags from form
function getCurrentTags() {
  return [...currentTaskTags];
}

// Get current tags from modal
function getCurrentModalTags() {
  return [...currentModalTags];
}

// Clear tags in main form
function clearFormTags() {
  currentTaskTags = [];
  const container = document.getElementById("selected-tags");
  if (container) container.innerHTML = "";
}

// Set tags in modal
function setModalTags(tags) {
  currentModalTags = [];
  const container = document.getElementById("modal-selected-tags");
  if (container) {
    container.innerHTML = "";
    tags.forEach((tag) => addTag(tag, container, currentModalTags));
  }
}

// Initialize tags system
document.addEventListener("DOMContentLoaded", () => {
  loadSavedTags();
  setupTagsInput();
  setupModalTagsInput();
  console.log("Custom tags system initialized!");
});

console.log("Custom tags input system loaded!");
