// contain logic for retrieving and adding new tasks(implemented later).

import { Task } from "./Task.js";

class Todos {
  #tasks = [];
  #backend_url = "";

  constructor(url) {
    this.#backend_url = url;
  }

  getTasks = async () => {
    return new Promise(async (resolve, reject) => {
      fetch(this.#backend_url)
        .then((response) => response.json())
        .then(
          (json) => {
            this.#readJson(json);
            resolve(this.#tasks);
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  // part4_Fetch executes post-call and has some extra parameters, such as method, headers, and body. Required endpoint (/new) is already implemented (and tested) on the backend receiving new task as JSON.
  addTask = async (text) => {
    return new Promise(async (resolve, reject) => {
      const json = JSON.stringify({ description: text });
      fetch(this.#backend_url + "/new", {
        method: "post",
        headers: { "Content-Type": "application/json" },
        body: json,
      })
        .then((response) => response.json())
        .then(
          (json) => {
            resolve(this.#addToArray(json.id, text));
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  // part5_Add method for removing task. Id will be passed as part of url and method is delete.Resolve will return id of deleted task (which is read from response but basically parameter id has the same value).
  removeTask = async (id) => {
    return new Promise(async (resolve, reject) => {
      fetch(this.#backend_url + "/delete/" + id, {
        method: "delete",
      })
        .then((response) => response.json())
        .then(
          (json) => {
            this.#removeFromArray(id);
            resolve(json.id);
          },
          (error) => {
            reject(error);
          }
        );
    });
  };

  #readJson = (tasksAsJson) => {
    tasksAsJson.forEach((node) => {
      const task = new Task(node.id, node.description);
      this.#tasks.push(task);
    });
  };

  // The method will also return added task.
  #addToArray = (id, text) => {
    const task = new Task(id, text);
    this.#tasks.push(task);
    return task;
  };

  // part5_adding a new private method that removes a task from the array based on id using filter method. First, all tasks that are not removed are filtered and then assigned to member variables (array tasks).

  #removeFromArray = (id) => {
    const arrayWithoutRemoved = this.#tasks.filter((task) => task.id !== id);
    this.#tasks = arrayWithoutRemoved;
  };
}

export { Todos };
