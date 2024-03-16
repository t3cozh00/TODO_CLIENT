class Task {
  #id;
  #text;

  constructor(id, text) {
    this.#id = id;
    this.#text = text;
  }

  getId() {
    return this.#id;
  }

  getText() {
    return this.#text;
  }
}

// export definition is required so other js files can import this file
export { Task };
