const taskForm = document.querySelector("#task-form");
const taskInput = document.querySelector("#task-input");
const taskList = document.querySelector("#task-list");
const taskCount = document.querySelector("#task-count strong");
const clockTime = document.querySelector("#clock-time");
const clockDate = document.querySelector("#clock-date");
const taskPriority = document.querySelector("#task-priority");
const taskSearch = document.querySelector("#task-search");
const noSearchResults = document.querySelector("#no-search-results");
const themeToggle = document.querySelector("#theme-toggle");
const historyList = document.querySelector("#history-list");
const historyCount = document.querySelector("#history-count");
const historyEmpty = document.querySelector("#history-empty");
const storageKey = "mot-ngay-that-tot-tasks";
const themeStorageKey = "mot-ngay-that-tot-theme";
const historyStorageKey = "mot-ngay-that-tot-history";
const maxHistoryEntries = 100;
const priorityLabels = {
  important: "Quan trọng",
  normal: "Bình thường",
  low: "Thấp",
};
const historyLabels = {
  added: "Đã thêm",
  edited: "Đã sửa",
  completed: "Đã hoàn thành",
  reopened: "Đã bỏ hoàn thành",
  deleted: "Đã xóa",
};

const vietnamTimeFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const vietnamDateFormatter = new Intl.DateTimeFormat("vi-VN", {
  timeZone: "Asia/Ho_Chi_Minh",
  weekday: "long",
  day: "numeric",
  month: "long",
});

function updateVietnamClock() {
  const now = new Date();
  clockTime.textContent = vietnamTimeFormatter.format(now);
  clockDate.textContent = vietnamDateFormatter.format(now);
}

function updateTaskCount() {
  taskCount.textContent = taskList.children.length;
}

function getTasks() {
  return [...taskList.querySelectorAll(".task-item:not(.is-removing)")].map((item) => ({
    text: item.querySelector(".task-text").textContent,
    completed: item.classList.contains("completed"),
    priority: item.dataset.priority || "normal",
  }));
}

function saveTasks() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(getTasks()));
  } catch (error) {
    console.error("Không thể lưu danh sách công việc vào LocalStorage:", error);
  }
}

function renderHistory(entries) {
  historyList.replaceChildren();
  for (const entry of entries) {
    const item = document.createElement("li");
    item.className = "history-item";

    const marker = document.createElement("span");
    marker.className = `history-marker history-${entry.action}`;
    marker.setAttribute("aria-hidden", "true");
    marker.textContent = entry.action === "deleted" ? "−" : entry.action === "completed" ? "✓" : "·";

    const content = document.createElement("div");
    content.className = "history-content";
    const description = document.createElement("p");
    description.className = "history-description";
    description.textContent = `${historyLabels[entry.action]}: ${entry.text}`;

    const timestamp = document.createElement("time");
    timestamp.className = "history-time";
    timestamp.dateTime = entry.timestamp;
    timestamp.textContent = new Intl.DateTimeFormat("vi-VN", {
      timeZone: "Asia/Ho_Chi_Minh",
      hour: "2-digit",
      minute: "2-digit",
      day: "numeric",
      month: "short",
    }).format(new Date(entry.timestamp));

    content.append(description, timestamp);
    item.append(marker, content);
    historyList.append(item);
  }
  historyCount.textContent = entries.length;
  historyEmpty.hidden = entries.length > 0;
}

function loadHistory() {
  try {
    const savedHistory = localStorage.getItem(historyStorageKey);
    if (savedHistory === null) {
      renderHistory([]);
      return [];
    }

    const entries = JSON.parse(savedHistory);
    if (
      !Array.isArray(entries) ||
      !entries.every(
        (entry) =>
          entry !== null &&
          Object.hasOwn(historyLabels, entry.action) &&
          typeof entry.text === "string" &&
          typeof entry.timestamp === "string" &&
          Number.isFinite(Date.parse(entry.timestamp)),
      )
    ) {
      throw new TypeError("Dữ liệu lịch sử hoạt động không đúng định dạng.");
    }

    const recentEntries = entries.slice(-maxHistoryEntries).reverse();
    renderHistory(recentEntries);
    return recentEntries.reverse();
  } catch (error) {
    console.error("Không thể tải lịch sử hoạt động từ LocalStorage:", error);
    renderHistory([]);
    return [];
  }
}

let historyEntries = loadHistory();

function recordHistory(action, text) {
  historyEntries.push({
    action,
    text,
    timestamp: new Date().toISOString(),
  });
  historyEntries = historyEntries.slice(-maxHistoryEntries);
  renderHistory([...historyEntries].reverse());

  try {
    localStorage.setItem(historyStorageKey, JSON.stringify(historyEntries));
  } catch (error) {
    console.error("Không thể lưu lịch sử hoạt động vào LocalStorage:", error);
  }
}

function applyTaskFilter() {
  const query = taskSearch.value.trim().toLocaleLowerCase("vi");
  let visibleCount = 0;

  for (const item of taskList.querySelectorAll(".task-item:not(.is-removing)")) {
    const matches = item.querySelector(".task-text").textContent
      .toLocaleLowerCase("vi")
      .includes(query);
    item.hidden = !matches;
    if (matches) visibleCount += 1;
  }

  noSearchResults.hidden = query.length === 0 || visibleCount > 0;
}

function setTheme(isDark) {
  document.documentElement.dataset.theme = isDark ? "dark" : "light";
  themeToggle.setAttribute("aria-pressed", String(isDark));
  themeToggle.setAttribute("aria-label", isDark ? "Bật chế độ sáng" : "Bật chế độ tối");
  themeToggle.querySelector(".theme-toggle-icon").textContent = isDark ? "☀" : "☾";
  themeToggle.querySelector(".theme-toggle-text").textContent = isDark ? "Chế độ sáng" : "Chế độ tối";
}

function loadTheme() {
  try {
    setTheme(localStorage.getItem(themeStorageKey) === "dark");
  } catch (error) {
    console.error("Không thể đọc chế độ giao diện từ LocalStorage:", error);
    setTheme(false);
  }
}

function addDeleteButton(item) {
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Xóa";
  deleteButton.setAttribute(
    "aria-label",
    `Xóa công việc: ${item.querySelector(".task-text").textContent}`,
  );
  deleteButton.addEventListener("click", () => {
    if (item.classList.contains("is-removing")) return;
    const text = item.querySelector(".task-text").textContent;

    let removalTimer;
    const removeItem = () => {
      if (!item.isConnected) return;
      window.clearTimeout(removalTimer);
      item.remove();
      updateTaskCount();
      applyTaskFilter();
    };

    const onAnimationEnd = (event) => {
      if (event.target !== item || event.animationName !== "task-fade-out") return;
      item.removeEventListener("animationend", onAnimationEnd);
      removeItem();
    };

    item.addEventListener("animationend", onAnimationEnd);
    item.classList.add("is-removing");
    recordHistory("deleted", text);
    saveTasks();
    removalTimer = window.setTimeout(removeItem, 1600);
  });
  item.append(deleteButton);
}

function setTaskCompleted(item, completed, save = true) {
  const wasCompleted = item.classList.contains("completed");
  item.classList.toggle("completed", completed);
  const checkbox = item.querySelector(".task-check");
  checkbox.checked = completed;
  if (save && wasCompleted !== completed) {
    recordHistory(completed ? "completed" : "reopened", item.querySelector(".task-text").textContent);
    saveTasks();
  }
}

function updateTaskDisplay(item, text, priority) {
  const taskText = item.querySelector(".task-text");
  const priorityTag = item.querySelector(".priority-tag");
  const deleteButton = item.querySelector(".delete-button");
  const checkbox = item.querySelector(".task-check");

  taskText.textContent = text;
  item.dataset.priority = priority;
  item.classList.remove("priority-important", "priority-normal", "priority-low");
  item.classList.add(`priority-${priority}`);
  priorityTag.textContent = priorityLabels[priority];
  deleteButton.setAttribute("aria-label", `Xóa công việc: ${text}`);
  checkbox.setAttribute("aria-label", `Đánh dấu hoàn thành: ${text}`);
}

function startTaskEdit(item) {
  if (item.classList.contains("is-editing") || item.classList.contains("is-removing")) return;

  const taskText = item.querySelector(".task-text");
  const priorityTag = item.querySelector(".priority-tag");
  const originalText = taskText.textContent;
  const originalPriority = item.dataset.priority || "normal";
  const editor = document.createElement("form");
  editor.className = "task-edit-form";

  const textInput = document.createElement("input");
  textInput.className = "task-edit-input";
  textInput.type = "text";
  textInput.maxLength = 120;
  textInput.value = originalText;
  textInput.setAttribute("aria-label", "Sửa nội dung công việc");

  const prioritySelect = document.createElement("select");
  prioritySelect.className = "task-edit-priority";
  prioritySelect.setAttribute("aria-label", "Sửa mức độ ưu tiên");
  for (const [value, label] of Object.entries(priorityLabels)) {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = label;
    prioritySelect.append(option);
  }
  prioritySelect.value = originalPriority;

  const saveButton = document.createElement("button");
  saveButton.className = "edit-save-button";
  saveButton.type = "submit";
  saveButton.textContent = "Lưu";

  const cancelButton = document.createElement("button");
  cancelButton.className = "edit-cancel-button";
  cancelButton.type = "button";
  cancelButton.textContent = "Hủy";

  editor.append(textInput, prioritySelect, saveButton, cancelButton);
  taskText.hidden = true;
  priorityTag.hidden = true;
  item.classList.add("is-editing");
  item.append(editor);
  textInput.focus();
  textInput.select();

  const finishEdit = (save) => {
    if (!item.isConnected) return;
    if (save) {
      const updatedText = textInput.value.trim();
      if (!updatedText) {
        alert("Vui lòng nhập nội dung!");
        textInput.focus();
        return;
      }

      const updatedPriority = priorityLabels[prioritySelect.value] ? prioritySelect.value : "normal";
      const changed = updatedText !== originalText || updatedPriority !== originalPriority;
      updateTaskDisplay(item, updatedText, updatedPriority);
      if (changed) {
        recordHistory("edited", updatedText);
        saveTasks();
      }
    }
    editor.remove();
    taskText.hidden = false;
    priorityTag.hidden = false;
    item.classList.remove("is-editing");
    applyTaskFilter();
  };

  editor.addEventListener("submit", (event) => {
    event.preventDefault();
    finishEdit(true);
  });
  cancelButton.addEventListener("click", () => finishEdit(false));
}

function addTask(text, completed = false, priority = "normal") {
  priority = priorityLabels[priority] ? priority : "normal";
  const item = document.createElement("li");
  item.className = "task-item";
  item.dataset.priority = priority;
  item.classList.add(`priority-${priority}`);
  if (completed) item.classList.add("completed");

  const checkbox = document.createElement("input");
  checkbox.className = "task-check";
  checkbox.type = "checkbox";
  checkbox.checked = completed;
  checkbox.setAttribute("aria-label", `Đánh dấu hoàn thành: ${text}`);

  const taskText = document.createElement("span");
  taskText.className = "task-text";
  taskText.textContent = text;
  taskText.title = "Nhấn đúp để sửa công việc";

  const priorityTag = document.createElement("span");
  priorityTag.className = "priority-tag";
  priorityTag.textContent = priorityLabels[priority];

  item.append(checkbox, taskText, priorityTag);
  addDeleteButton(item);
  checkbox.addEventListener("change", () => {
    setTaskCompleted(item, checkbox.checked);
  });
  let completionClickTimer;
  taskText.addEventListener("click", (event) => {
    if (taskText instanceof HTMLLabelElement) event.preventDefault();
    if (event.detail > 1) {
      window.clearTimeout(completionClickTimer);
      return;
    }
    completionClickTimer = window.setTimeout(() => {
      setTaskCompleted(item, !item.classList.contains("completed"));
    }, 250);
  });
  taskText.addEventListener("dblclick", () => {
    window.clearTimeout(completionClickTimer);
    startTaskEdit(item);
  });
  taskList.append(item);
  updateTaskCount();
  applyTaskFilter();
}

function loadTasks() {
  const initialTasks = [...taskList.querySelectorAll(".task-item")].map((item) => ({
    text: item.querySelector(".task-text").textContent,
    completed: item.querySelector(".task-check").checked,
    priority: item.dataset.priority || "normal",
  }));
  let tasks = initialTasks;

  try {
    const savedTasks = localStorage.getItem(storageKey);
    if (savedTasks !== null) {
      const parsedTasks = JSON.parse(savedTasks);
      if (
        !Array.isArray(parsedTasks) ||
        !parsedTasks.every(
          (task) =>
            task !== null &&
            typeof task.text === "string" &&
            typeof task.completed === "boolean" &&
            (task.priority === undefined || Object.hasOwn(priorityLabels, task.priority)),
        )
      ) {
        throw new TypeError("Dữ liệu danh sách công việc không đúng định dạng.");
      }
      tasks = parsedTasks;
    }
  } catch (error) {
    console.error("Không thể tải danh sách công việc từ LocalStorage:", error);
  }

  taskList.replaceChildren();
  for (const task of tasks) {
    const priority = priorityLabels[task.priority] ? task.priority : "normal";
    addTask(task.text, task.completed, priority);
  }
  saveTasks();
  applyTaskFilter();
}

loadTasks();
loadTheme();
updateVietnamClock();
window.setInterval(updateVietnamClock, 1000);

taskSearch.addEventListener("input", applyTaskFilter);

themeToggle.addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme !== "dark";
  setTheme(isDark);
  try {
    localStorage.setItem(themeStorageKey, isDark ? "dark" : "light");
  } catch (error) {
    console.error("Không thể lưu chế độ giao diện vào LocalStorage:", error);
  }
});

taskForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = taskInput.value.trim();

  if (!text) {
    alert("Vui lòng nhập nội dung!");
    taskInput.focus();
    return;
  }

  addTask(text, false, taskPriority.value);
  recordHistory("added", text);
  saveTasks();
  taskForm.reset();
  taskPriority.value = "normal";
  taskInput.focus();
});
