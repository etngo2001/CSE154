"use strict";
(function() {

  let timerId;
  let remainingSeconds;
  const STYLE = ["solid", "outline", "striped"];
  const SHAPE = ["diamond", "oval", "squiggle"];
  const COLOR = ["green", "purple", "red"];
  const COUNT = [1, 2, 3];
  const MINORSECOND = 60; // CHANGE
  const SECOND = 1000; // CHANGE

  window.addEventListener("load", init);

  /**
   * Upon the webpage loading, the init function is run to allow access to all other
   * functions of a webpage.
   */
  function init() {
    id("start-btn").addEventListener("click", function() {
      toggleViews();
      startTimer();
    });
    id("back-btn").addEventListener("click", function() {
      toggleViews();
      id("refresh-btn").disabled = false;
    });
    id("refresh-btn").addEventListener("click", genGameCards);
  }

  /**
   * Used to switch between the menu view and game view of the game.
   * No parameters.
   * No return value.
   */
  function toggleViews() {
    let gameView = id("game-view");
    let menuView = id("menu-view");

    menuView.classList.toggle("hidden");
    gameView.classList.toggle("hidden");

    if (!gameView.classList.contains("hidden")) {
      id("set-count").textContent = 0;
      genGameCards();
    }
  }

  /**
   * Returns a randomly-generated array of
   * string attributes in the form [STYLE, SHAPE, COLOR, COUNT]
   * @param {InputEvent} isEasy - user's chosen difficulty
   * @returns {Array} - array of a card with randomly generated attributes
   */
  function generateRandomAttributes(isEasy) {
    let attributes = ["style", "shape", "color", "count"];

    attributes[0] = STYLE[Math.floor(Math.random() * 3)];
    if (isEasy) {
      attributes[0] = "solid";
    }
    attributes[1] = SHAPE[Math.floor(Math.random() * 3)];
    attributes[2] = COLOR[Math.floor(Math.random() * 3)];
    attributes[3] = COUNT[Math.floor(Math.random() * 3)];

    return attributes;
  }

  /**
   * Return a div element with COUNT number of img elements appended as children
   * @param {InputEvent} isEasy - user's chosen difficulty
   * @returns {Element} - created div element with unique pattern of images
   */
  function generateUniqueCard(isEasy) {
    let atr = generateRandomAttributes(isEasy);
    let uniqueAtr = atr[0] + '-' + atr[1] + '-' + atr[2] + '-' + atr[3];
    while (id(uniqueAtr)) {
      atr = generateRandomAttributes(isEasy);
      uniqueAtr = atr[0] + '-' + atr[1] + '-' + atr[2] + '-' + atr[3];
    }
    let atrCount = atr.splice(3, 1);
    let card = document.createElement("div");

    card.setAttribute("id", uniqueAtr);
    card.classList.add("card");

    for (let i = 0; i < atrCount; i++) {
      let cardImg = document.createElement('img');
      cardImg.src = "img/" + atr[0] + '-' + atr[1] + '-' + atr[2] + '.png';
      cardImg.alt = uniqueAtr;
      card.appendChild(cardImg);
    }

    card.addEventListener("click", cardSelected);

    return card;
  }

  /**
   * Starts the timer for a new game.
   * No parameters.
   * No return value.
   */
  function startTimer() {
    let select = qs("select");
    let time = select.options[select.selectedIndex].value;
    timerId = null;
    remainingSeconds = time;

    id("time").textContent = "0" + Math.floor(remainingSeconds / MINORSECOND) + ":00";

    timerId = setInterval(function() {
      advanceTimer();
    }, SECOND);
  }

  /**
   * Updates the game timer by 1 second. If the timer hits 0 then the game ends.
   * No parameters.
   * No return value.
   */
  function advanceTimer() {
    const BELOWTEN = 10;

    remainingSeconds--;

    if (remainingSeconds >= 0) {
      let minutes = Math.floor(remainingSeconds / MINORSECOND);
      let seconds = remainingSeconds % MINORSECOND;
      let time = id("time");

      if (seconds < BELOWTEN) {
        seconds = "0" + seconds;
      }
      time.textContent = "0" + minutes + ":" + seconds;
    }

    if (remainingSeconds < 0) {
      clearInterval(timerId);
      timerId = null;
      endGame();
    }
  }

  /**
   * Keeps track of and updates the score.
   * @param {boolean} set - whether the selected set is valid or not
   * No return value.
   */
  function playGame(set) {
    let setCount = Number(id("set-count").textContent);
    if (set) {
      setCount++;
      id("set-count").textContent = setCount;
    }
  }

  /**
   * Generates 9 to 12 cards depending on the selected difficulty level
   * and fills the board with cards upon game start or upon refresh.
   * No parameters.
   * no return value.
   */
  function genGameCards() {
    let board = id("board");
    let len = 12;
    board.innerHTML = "";

    if (qs("input").checked) {
      len = 9;
    }

    for (let i = 0; i < len; i++) {
      let card = generateUniqueCard(qs("input").checked);
      board.appendChild(card);
    }
  }

  /**
   * ends the game and no longer allows the user to interact with the board
   * nor refresh the board.
   * No parameters.
   * No return value.
   */
  function endGame() {
    unSelect();
    id("refresh-btn").disabled = true;
    let board = qsa(".card");
    for (let i = 0; i < board.length; i++) {
      board[i].removeEventListener("click", cardSelected);
    }
  }

  /**
   * Used when a card is selected, checking how many cards are currently selected. If
   * 3 cards are selected, uses isASet to handle "correct" and "incorrect" cases.
   * No parameters.
   * No return value.
   */
  function cardSelected() {
    this.classList.toggle("selected");

    if (qsa(".selected").length === 3) {
      setOrNotSet(qsa(".selected"));
    }

  }

  /**
   * Checks the list of selected nodes using isASet to check if the set is valid
   * or invalid. Then displays the result, telling the user that it is a "Set" or
   * is "Not a Set." Then returns the cards to normal and unselected them.
   * @param {NodeList} selected - list of selected nodes.
   * No return value.
   */
  function setOrNotSet(selected) {
    let ids = [];
    let setResult = "Not a Set";
    let set = isASet(selected);

    for (let i = 0; i < selected.length; i++) {
      ids.push(selected[i].id);
    }

    if (set) {
      ids = cardReplace(ids);
      setResult = "SET!";
      playGame(true);
    }

    for (let index = 0; index < 3; index++) {
      let paragraph = document.createElement("p");
      paragraph.textContent = setResult;
      id(ids[index]).appendChild(paragraph);
      id(ids[index]).classList.add("hide-imgs");
    }

    unSelect();
    setTimeout(replaceBack, SECOND);
  }

  /**
   * takes a list of card IDs as a parameter and makes a unique list with
   * new cards. Then returns the updated list. This essentially generates
   * new cards that replace found sets.
   * @param {list} idList - current selected card IDs
   * @returns {list} - updated list of card IDs
   */
  function cardReplace(idList) {
    for (let x = 0; x < 3; x++) {
      let newCard = generateUniqueCard(qs("input").checked);

      id("board").replaceChild(newCard, id(idList[x]));
      idList[x] = newCard.id;
    }
    return idList;
  }

  /**
   * Changes the view of the card from the displayed paragraph telling users
   * whether it is a set or not, back to the card image for the game to continue.
   * No parameters.
   * No return value.
   */
  function replaceBack() {
    let hiddenImgs = qsa(".hide-imgs");
    for (let y = 0; y < 3; y++) {
      let curr = hiddenImgs[y].querySelector("p");
      hiddenImgs[y].removeChild(curr);
      id("board").querySelector(".hide-imgs").classList.remove("hide-imgs");
    }
  }

  /**
   * Unselects all selected cards.
   * No parameters.
   * No return value.
   */
  function unSelect() {
    let slctd = qsa(".selected");
    for (let i = 0; i < slctd.length; i++) {
      slctd[i].classList.remove("selected");
    }
  }

  /**
   * Checks to see if the three selected cards make up a valid set. This is done by comparing each
   * of the type of attribute against the other two cards. If each four attributes for each card are
   * either all the same or all different, then the cards make a set. If not, they do not make a set
   * @param {DOMList} selected - list of all selected cards to check if a set.
   * @return {boolean} true if valid set false otherwise.
   */
  function isASet(selected) {
    let attributes = [];
    for (let i = 0; i < selected.length; i++) {
      attributes.push(selected[i].id.split("-"));
    }
    for (let i = 0; i < attributes[0].length; i++) {
      let diff = attributes[0][i] !== attributes[1][i] &&
                attributes[1][i] !== attributes[2][i] &&
                attributes[0][i] !== attributes[2][i];
      let same = attributes[0][i] === attributes[1][i] &&
                    attributes[1][i] === attributes[2][i];
      if (!(same || diff)) {
        return false;
      }
    }
    return true;
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