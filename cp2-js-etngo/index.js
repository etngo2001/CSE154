/*
 *Eugene Ngo
 *October 19 2022
 *Section AA: Allan Tran
 *
 *This is the js file for CP2. This file will handle the adding of tasks to the planner,
 *as well as the removal of tasks and changing the background for fun.
 */
"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Upon the webpage loading, the init function is run to allow access to all other
   * functions of a webpage.
   */
  function init() {
    let taskCreator = id("add-button");
    taskCreator.addEventListener("click", addTask);

    let taskClearer = id("clr-all");
    taskClearer.addEventListener("click", clearAll);

    let taskClear = qsa("#planner #tasks #task-list");
    for (let i = 0; i < taskClear.length; i++) {
      taskClear[i].addEventListener("click", clickClear);
    }

    qsa(".here")[0].addEventListener("click", sadge);
    qsa(".here")[1].addEventListener("click", notSadge);

    let personalizePage = id("name");
    personalizePage.addEventListener("keypress", addName);
  }

  /**
   * Enables the user to add a task and its due date to the to-do list. Then this function takes
   * today's date and adds it to the inputted information. The task, its due date, and date added
   * are assigned a unique class which associates the three pieces of information for easier
   * removal. The task counter is then incremented to appropriately reflect how many tasks are
   * in the to-do list.
   */
  function addTask() {
    if (id("task-text").value !== "") {
      let task = id("task-list");
      let dueDate = id("date-due");
      let addDate = id("date-add");
      let currentTaskNum = parseInt(id("task-num").textContent);
      const currentDate = new Date();
      let newTask = document.createElement('p');
      let newDate = document.createElement('p');
      let dateAdded = document.createElement('p');
      let taskText = id("task-text").value;
      let dueDateText = id("due").value;
      newTask.textContent = taskText;
      newTask.classList.add("task-" + currentTaskNum);
      newDate.textContent = dueDateText;
      newDate.classList.add("task-" + currentTaskNum);
      dateAdded.textContent = currentDate.getMonth() + 1 + '/' + currentDate.getDate();
      dateAdded.classList.add("task-" + currentTaskNum);
      newTask.classList.add("task");
      newDate.classList.add("task");
      dateAdded.classList.add("task");
      task.appendChild(newTask);
      dueDate.appendChild(newDate);
      addDate.appendChild(dateAdded);
      id("task-text").value = "";
      id("due").value = "";
      id("task-num").textContent = currentTaskNum + 1;
    }
  }

  /** Enables the user to completely clear their task list and resets the task counter to 0. */
  function clearAll() {
    const allTasks = qsa(".task");
    allTasks.forEach(task => task.remove());
    id("task-num").textContent = 0;
  }

  /**
   * Enables the user to click on a task which then removes the task from the task list
   * along with its associated due date and date added. Then the task counter will decrement
   * to accurately reflect how many tasks the user has remaining.
   * @param {event} event - the event when the user clicks on the "Clear ALL" button
   */
  function clickClear(event) {
    let x = event.target.classList[0];
    id("task-num").textContent = parseInt(id("task-num").textContent) - 1;
    const taskArray = qsa("." + x);
    taskArray.forEach(task => task.remove());
  }

  /**
   * If 10 or more task have been added to the to-do list and this button is clicked on,
   * then it will set the background image of the site to a sad cat. If the user attempts
   * to set the background back because they were called lame, then they'll be reassured
   * that they are, in fact, still lame. :)
   */
  function sadge() {
    if (id("task-num").textContent >= parseInt(id("too-many").textContent)) {
      document.body.classList.add("funny-background-img");
    }
    if (qs(".hidden-msg").id === "lame") {
      qsa(".hidden-msg")[1].id = "still-lame";
    }
  }

  /**
   * Removes the sad cat image from the background and instead displays
   * a hidden message in the footer.
   */
  function notSadge() {
    if (document.body.classList.contains("funny-background-img")) {
      document.body.classList.remove("funny-background-img");
      qs(".hidden-msg").id = "lame";
    }
  }

  /**
   * Enables the user to personalize the to-do webpage with their name.
   * @param {event} event - the event when the user presses 'enter' after inputting their name
   */
  function addName(event) {
    if (event.key === "Enter") {
      let inputName = id("name").value;
      inputName += "'s ";
      qs("header h1").textContent = inputName + qs("header h1").textContent;
      id("name").value = "";
      id("personalize").classList.add("one-use");
    }
  }

  // Below here are helper methods used to simplify the above functions.

  /**
   * quickly retrieves an element with given id 'name'
   * @param {String} name - unique IDs of elements
   * @return {Element} the element with the given ID
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * quickly retrieves the first element with the given selector
   * @param {String} selector - a css selector
   * @return {Element} the first element that the css selector finds
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * quickly retrieves an array of all elements with the given selector
   * @param {String} selector - a css selector
   * @return {Array} an array of all of the elements that the css selector applies to
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }

})();