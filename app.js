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
const storageKey = "mot-ngay-that-tot-tasks";
const themeStorageKey = "mot-ngay-that-tot-theme";
const priorityLabels = {
  important: "Quan trọng",
  normal: "Bình thường",
  low: "Thấp",
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

function addDeleteButton(item, text) {
  const deleteButton = document.createElement("button");
  deleteButton.className = "delete-button";
  deleteButton.type = "button";
  deleteButton.textContent = "Xóa";
  deleteButton.setAttribute("aria-label", `Xóa công việc: ${text}`);
  deleteButton.addEventListener("click", () => {
    if (item.classList.contains("is-removing")) return;

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
    saveTasks();
    removalTimer = window.setTimeout(removeItem, 1600);
  });
  item.append(deleteButton);
}

function setTaskCompleted(item, completed, save = true) {
  item.classList.toggle("completed", completed);
  const checkbox = item.querySelector(".task-check");
  checkbox.checked = completed;
  if (save) saveTasks();
}

function addTask(text, completed = false) {
  const priority = priorityLabels[taskPriority.value] ? taskPriority.value : "normal";
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

  const priorityTag = document.createElement("span");
  priorityTag.className = "priority-tag";
  priorityTag.textContent = priorityLabels[priority];

  item.append(checkbox, taskText, priorityTag);
  addDeleteButton(item, text);
  checkbox.addEventListener("change", () => {
    item.classList.toggle("completed", checkbox.checked);
    saveTasks();
  });
  taskText.addEventListener("click", (event) => {
    if (taskText instanceof HTMLLabelElement) event.preventDefault();
    setTaskCompleted(item, !item.classList.contains("completed"));
  });
  taskList.append(item);
  updateTaskCount();
  applyTaskFilter();
}

function loadTasks() {
  const initialTasks = [...taskList.querySelectorAll(".task-item")].map((item) => ({
    text: item.querySelector(".task-text").textContent,
    completed: item.querySelector(".task-check").checked,
    priority: "normal",
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
    taskPriority.value = task.priority || "normal";
    addTask(task.text, task.completed);
  }
  taskPriority.value = "normal";
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

  addTask(text);
  saveTasks();
  taskForm.reset();
  taskPriority.value = "normal";
  taskInput.focus();
});
