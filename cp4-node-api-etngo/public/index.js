/*
 * Eugene Ngo
 * November 27 2022
 * Section AA: Allan Tran
 *
 * This is the index.js for my One Piece page which provides information on each of the Straw Hat
 * Pirates. This file helps change the views to display the desired information and take in user
 * inputs.
 */

"use strict";
(function() {

  window.addEventListener("load", init);

  /**
   * Initializes and sets up the page.
   */
  function init() {
    let enterGrandLine = id("enter");
    enterGrandLine.addEventListener("click", switchViewInit);

    let goBack = id("go-back");
    goBack.addEventListener("click", switchViewInit);

    let meetAll = id("meet-all");
    meetAll.addEventListener("click", getAll);

    let findPirate = id("go");
    findPirate.addEventListener("click", getOne);
  }

  /**
   * Init function to call switchView
   */
  function switchViewInit() {
    let element;
    if (qs(".active").id === "intro") {
      element = id("options");
      switchView(element);
    }
    if (qs(".active").id === "pirates") {
      element = id("options");
      clean();
      switchView(element);
    }
  }

  /**
   * Switches the user-view to display the appropriate information:
   * -introduction on start
   * -options for user-input
   * -desired information after user-input
   * @param {object} card - DOM object that specifies which view to switch to
   * No return value
   */
  function switchView(card) {
    let options = qs("#options");
    let pirates = qs("#pirates");
    qs(".active").classList.remove("active");
    if (Object.is(card.id, "options")) {
      options.classList.add("active");
    }
    if (Object.is(card.id, "pirates")) {
      pirates.classList.add("active");
    }
  }

  /**
   * fetch a list of all the straw hat pirates and list them out
   */
  function getAll() {
    fetch("/all")
      .then(statusCheck)
      .then(response => response.json())
      .then(listAll)
      .then(switchView(id("pirates")))
      .catch(handleError);
  }

  /**
   * fetch a list of all strawhat pirates and display them all
   * @param {object} data - json object of all the pirates
   */
  function listAll(data) {
    for (let i = 0; i < data.pirates.length; i++) {
      let container = document.createElement("p");
      let pirateList = document.createElement("ul");
      let pirates = document.createElement("li");
      pirates.textContent = data.pirates[i].name;
      pirateList.appendChild(pirates);
      container.appendChild(pirateList)
      id("pirate-card").appendChild(container);
    }
  }

  /**
   * Removes all of the information off the pirate-card to allow the user to look up a different
   * pirate
   */
  function clean() {
    const allTasks = qsa("#pirate-card > p");
    allTasks.forEach(task => task.remove());
    id("name").value = "";
  }

  /**
   * Fetches the JSON data of the user-specified pirate and displays detailed information
   * on the pirate
   */
  function getOne() {
    fetch("/pirate/" + id("name").value.toLowerCase())
      .then(statusCheck)
      .then(response => response.json())
      .then(listOne)
      .then(switchView(id("pirates")))
      .catch(handleError);
  }

  /**
   * Fetches the JSON of the selected pirate and displays the details of the selected pirate
   * @param {object} data - json object of specific pirate information
   */
  function listOne(data) {
    let tFullName = document.createElement("p");
    tFullName.textContent = "Full Name: " + data.fullName;
    let tTitle = document.createElement("p");
    tTitle.textContent = "Title: " + data.title;
    let tRace = document.createElement("p");
    tRace.textContent = "Race: " + data.race;
    let tOrigin = document.createElement("p");
    tOrigin.textContent = "Origin: " + data.origin;
    let tCrew = document.createElement("p");
    tCrew.textContent = "Crew: " + data.crew;
    let tRole = document.createElement("p");
    tRole.textContent = "Role: " + data.role;
    let tDevilFruit = document.createElement("p");
    tDevilFruit.textContent = "Devil Fruit: " + data.devilFruit;
    let tDevilFruitType = document.createElement("p");
    tDevilFruitType.textContent = "Devil Fruit Type: " + data.devilFruitType;
    let tBounty = document.createElement("p");
    tBounty.textContent = "Bounty: " + data.bounty;
    id("pirate-card").appendChild(tFullName);
    id("pirate-card").appendChild(tTitle);
    id("pirate-card").appendChild(tRace);
    id("pirate-card").appendChild(tOrigin);
    id("pirate-card").appendChild(tCrew);
    id("pirate-card").appendChild(tRole);
    id("pirate-card").appendChild(tDevilFruit);
    id("pirate-card").appendChild(tDevilFruitType);
    id("pirate-card").appendChild(tBounty);
  }

  /**
   * Displays an error message to the user if an error is hit
   * @param {object} err - the error, or issue at hand
   */
  function handleError(err) {
    let errMsg = document.createElement("p");
    errMsg.textContent = "Uh oh. Something went wrong. Please try again later.";
    let errMsgDeets = document.createElement("p");
    errMsgDeets.textContent = "(" + err + ")";
    qs("#pirate-card").textContent = "";
    qs("#pirate-card").appendChild(errMsg);
    qs("#pirate-card").appendChild(errMsgDeets);
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