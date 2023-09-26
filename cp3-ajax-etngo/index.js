
"use strict";
(function() {

  window.addEventListener("load", init);

  const BASE_URL = "https://excuser.herokuapp.com/";

  /**
   * Initializes and sets up the page
   */
  function init() {
    let getStartedButton = id("get-started");
    getStartedButton.addEventListener("click", switchViewInit);

    let findExcuseCat = id("go");
    findExcuseCat.addEventListener("click", generateExcuses);

    let goBack = id("go-back");
    goBack.addEventListener("click", switchViewInit);
  }

  /**
   * Fetches the excuses of specified category and quantity that the user requested and calls
   * functions to display it
   * @param {string} type - the type of excuse that the user requested
   * @param {string} num - the number of excuses the user requested
   * No return value
   */
  function fetchExcuses(type, num) {
    let url = BASE_URL + "v1/" + type + "/" + num;
    fetch(url)
      .then(statusCheck)
      .then((response) => response.json())
      .then(json => makeExcuses(json))
      .catch(handleError);
  }

  /**
   * Takes the inputted data array and goes through each element retrieving the excuse from
   * each excuse object. Then creates a new element and adds that excuse as a child to the excuse
   * card which displays the generated excuse(s) for users to see
   * @param {array} data - Array of excuse objects
   * No return value
   */
  function makeExcuses(data) {
    data.forEach(element => {
      let excuseText = document.createElement("p");
      excuseText.innerText = element["excuse"];
      qs("#excuse-card").appendChild(excuseText);
    });
  }

  /**
   * Init function to call switchView
   * No parameters
   * No return value
   */
  function switchViewInit() {
    let element;
    if (qs(".active").id === "introduction") {
      element = id("options");
      switchView(element);
    }
    if (qs(".active").id === "response") {
      clean();
      element = id("introduction");
      switchView(element);
    }
  }

  /**
   * Removes all of the excuses from the excuse card to allow the user to generate new excuses
   * No parameters
   * No return value
   */
  function clean() {
    const allTasks = qsa("#excuse-card > p");
    allTasks.forEach(task => task.remove());
  }

  /**
   * Takes the user inputs for category and quantity and calls fetchExcuse to get the excuses
   * and display it for the users. Then switches the view of the webpage so the user can see the
   * generated excuses
   * No parameters
   * No return values
   */
  function generateExcuses() {
    let category = "excuse";
    let selectedCat = id("categories");
    selectedCat = selectedCat.options[selectedCat.selectedIndex].value;
    let selectedNum = id("quantity");
    selectedNum = selectedNum.options[selectedNum.selectedIndex].text;
    if (selectedCat !== "random") {
      category = category + "/" + selectedCat;
    }
    fetchExcuses(category, selectedNum);
    switchView(id("response"));
  }

  /**
   * Displays the error message to the user
   * @param {object} error - the error
   * No return value
   */
  function handleError(error) {
    let getStartedButton = qs("#get-started");
    getStartedButton.remove();

    let goBackButton = qs("#go-back");
    goBackButton.remove();

    let errorText = document.createElement("p");
    errorText.innerText = "An error occurred! Please try again later...";

    let detailedErrorText = document.createElement("p");
    detailedErrorText.innerText = "(" + error + ")";

    let errorInfo = qs("#excuse-card");
    errorInfo.innerHTML = "";
    errorInfo.appendChild(errorText);
    errorInfo.appendChild(detailedErrorText);

    switchView(id("response"));
  }

  /**
   * Switches the view from introduction to options to response and back to introduction in
   * that order
   * @param {object} card - DOM object that specifies which view to switch to
   * No return value
   */
  function switchView(card) {
    let introduction = qs("#introduction");
    let options = qs("#options");
    let response = qs("#response");
    qs(".active").classList.remove("active");
    if (Object.is(card.id, "introduction")) {
      introduction.classList.add("active");
    }
    if (Object.is(card.id, "options")) {
      options.classList.add("active");
    }
    if (Object.is(card.id, "response")) {
      response.classList.add("active");
    }
  }

  /**
   * Helper function to return the response's result text if successful, otherwise
   * returns the rejected Promise result with an error status and corresponding text
   *
   * (Taken directly from the CSE 154 Slides)
   *
   * @param {object} res - response to check for success/error
   * @returns {object} - valid result text if response was successful, otherwise throws an error
   */
  async function statusCheck(res) {
    if (!res.ok) {
      throw new Error(await res.text());
    }
    return res;
  }

  /**
   * Below here are helper methods used to simplify the above functions.
   *
   * (Taken directly from CSE 154 Slides)
   */

  /**
   * Returns the element that has the ID attribute with the specified value.
   * @param {string} name - element ID.
   * @returns {object} - DOM object associated with id.
   */
  function id(name) {
    return document.getElementById(name);
  }

  /**
   * Returns first element matching selector.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
  function qs(selector) {
    return document.querySelector(selector);
  }

  /**
   * Returns an array of elements matching the given query.
   * @param {string} selector - CSS query selector.
   * @returns {array} - Array of DOM objects matching the given query.
   */
  function qsa(selector) {
    return document.querySelectorAll(selector);
  }
})();