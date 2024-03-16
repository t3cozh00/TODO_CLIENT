// constant variable that holds url for the backend
const BACKEND_ROOT_URL = "http://localhost:3001";

// Import required classes and create an object of Todos class.
import { Todos } from "./class/Todos.js";

const todos = new Todos(BACKEND_ROOT_URL);
//const task = new Task();

const list = document.querySelector("ul");
const input = document.querySelector("input");

//input.disabled = true;

// Create a separate function for rendering a task. This (same) function will be used, when a new task is added, or tasks are retrieved from backend. Test out that front-end is still working after making following modification.
// part5_Row on a list will contain text and an icon.To make code more structured, clear, and readable, separate functions for creating span and link are created.
// part5_RenderSpan function receives a list item element and text as parameters. Span is appended as a child for the list item containing text (task description).
const renderSpan = (li, text) => {
  const span = li.appendChild(document.createElement("span"));
  span.innerHTML = text;
};

// part5_Link function receives list item and task id as parameters. The Link contains Bootstrap icon (trash). The link and icon are displayed on the right (at the end of the list row so it is floated to the right using CSS). At this point, nothing happens yet if the icon is pressed.
const renderLink = (li, id) => {
  const a = li.appendChild(document.createElement("a"));
  a.innerHTML = '<i class="bi bi-trash"></i>';
  a.setAttribute("style", "float: right");
  // part5_Add click listener to link. When the link (icon) is clicked, the removeTask method is called from the todos object. Data is deleted through an HTTP call to the backend and UI is updated.
  a.addEventListener("click", (event) => {
    todos
      .removeTask(id)
      .then((removed_id) => {
        const li_to_remove = document.querySelector(
          `[data-key = '${removed_id}']`
        );
        if (li_to_remove) {
          list.removeChild(li_to_remove);
        }
      })
      .catch((error) => {
        alter(error);
      });
  });
};

const renderTask = (task) => {
  console.log(task);
  const li = document.createElement("li");
  li.setAttribute("class", "list-group-item");
  // part5_Modify renderTask function so, that each list item (row) contains data-key attribute, which has task id stored into it. This will be used for locating list item that needs to be removed from UI when task is deleted (seems no need for this step)
  //li.innerHTML = task.getText();
  li.setAttribute("data-key", task.getId().toString());
  renderSpan(li, task.getText());
  renderLink(li, task.getId());
  list.append(li);
};

// Define following function that fetches data from the backend by making HTTP call.  JSON is received as response. JSON (array) is looped through and each JSON object holding task is rendered to the UI.
const getTasks = async () => {
  todos
    .getTasks()
    .then((tasks) => {
      tasks.forEach((task) => {
        renderTask(task);
      });
      input.disabled = false;
    })
    .catch((error) => {
      alter(error);
    });
};

// A fetch call using post HTTP method is implemented.
const saveTask = async (task) => {
  try {
    input.disabled = true;
    const json = JSON.stringify({ description: task });
    const response = await fetch(BACKEND_ROOT_URL + "/new", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: json,
    });
    return response.json();
  } catch (error) {
    alter("Error saving task" + error.message);
  }
};

// add new keypress event
// part4_Update addEventListener so it uses the method implemented on the Todos class. addTask receives a description for the task as a parameter and the inserted task object (with id returned from the database) is returned/resolved. That is rendered on UI, the input field is emptied, and the focus is set to it (so the user can easily add another task)
input.addEventListener("keypress", (event) => {
  if (event.key === "Enter") {
    console.log("Event fired!");
    event.preventDefault();
    const task = input.value.trim();
    if (task !== "") {
      // const li = document.createElement("li");
      // li.setAttribute("class", "list-group-item");
      // li.innerHTML = task;
      // list.append(li);
      //saveTask(task).then((json) => {
      todos.addTask(task).then((task) => {
        renderTask(task);
        input.value = "";
        input.focus();
      });
    }
  }
});

getTasks();
