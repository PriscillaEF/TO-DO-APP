// write in the input box
// clear out the li
// click + and it appears in an li
// the number in tasks to do updates according to what we have
// click the check icon and it goes to donr
// the number in done updates according to what we have
// click the trash icon and what was written gets deleted
// add local storage to store what is written incase i refresh

document.addEventListener("DOMContentLoaded", () => {
  const inputBox = document.getElementById("input-box");
  const addButton = document.getElementById("add");
  const tasksContainer = document.getElementById("lists");
  const doneContainer = document.querySelector(".task-done");
  const tasksCount = document.querySelector(".tasks #count-task");
  const doneCount = document.querySelector(".complete #count-done");

  // Load tasks from local storage
  loadTasks();

  // Function to update the task count
  function updateCount() {
    tasksCount.textContent = tasksContainer.childElementCount;
    doneCount.textContent = doneContainer.childElementCount;
  }

  // Function to create a new task item
  function createTaskItem(taskText, isDone = false) {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = taskText;
    li.appendChild(span);

    const div = document.createElement("div");
    const checkIcon = document.createElement("i");
    checkIcon.className = "fas fa-check";
    checkIcon.addEventListener("click", () => toggleTaskDone(li, taskText));

    const trashIcon = document.createElement("i");
    trashIcon.className = "fas fa-trash";
    trashIcon.addEventListener("click", () => confirmDeleteTask(li));

    div.appendChild(checkIcon);
    div.appendChild(trashIcon);

    li.appendChild(div);

    if (isDone) {
      doneContainer.appendChild(li);
      checkIcon.style.display = "none"; // Hide the check icon for done tasks
      trashIcon.style.color = "#78cfb0"; // Set color of trash icon in done tasks
      div.style.order = 2; // Ensure the delete icon is at the far right
      div.style.marginLeft = "auto"; // Push the delete icon to the far right
    } else {
      tasksContainer.appendChild(li);
    }

    updateCount();
    saveTasks();
  }

  // Function to add a new task
  function addTask() {
    const taskText = inputBox.value.trim();
    if (taskText === "") {
      alert("Task cannot be empty.");
      return;
    }
    createTaskItem(taskText);
    inputBox.value = "";
  }

  // Function to toggle a task between done and not done
  function toggleTaskDone(taskItem, taskText) {
    if (taskItem.parentElement === tasksContainer) {
      // Move task to doneContainer
      taskItem.remove();
      createTaskItem(taskText, true);
    }
    updateCount();
    saveTasks();
  }

  // Function to confirm deletion of a task
  function confirmDeleteTask(taskItem) {
    const confirmDeletion = confirm(
      "Are you sure you want to delete this task?"
    );
    if (confirmDeletion) {
      deleteTask(taskItem);
    }
  }

  // Function to delete a task
  function deleteTask(taskItem) {
    taskItem.remove();
    updateCount();
    saveTasks();
  }

  // Function to save tasks to local storage
  function saveTasks() {
    const tasks = [];
    const doneTasks = [];

    tasksContainer.querySelectorAll("li").forEach((task) => {
      tasks.push({
        text: task.querySelector("span").textContent.trim(),
        done: false,
      });
    });

    doneContainer.querySelectorAll("li").forEach((task) => {
      doneTasks.push({
        text: task.querySelector("span").textContent.trim(),
        done: true,
      });
    });

    localStorage.setItem("tasks", JSON.stringify(tasks));
    localStorage.setItem("doneTasks", JSON.stringify(doneTasks));
  }

  // Function to load tasks from local storage
  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const doneTasks = JSON.parse(localStorage.getItem("doneTasks")) || [];

    tasks.forEach((task) => createTaskItem(task.text, task.done));
    doneTasks.forEach((task) => createTaskItem(task.text, task.done));
  }

  // Add task when clicking the add button
  addButton.addEventListener("click", addTask);

  // Add task when pressing Enter key
  inputBox.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
      addTask();
    }
  });
});
