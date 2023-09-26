"use strict";
(function() {

  window.addEventListener("load", init);

  const BASE_URL = "https://courses.cs.washington.edu/courses/cse154/webservices/pokedex/";
  const POKEMON = "pokedex.php?pokedex=all";
  const POKEMON_DATA = "pokedex.php?pokemon=";
  const GAME_PHP = "game.php";

  let pokemons = [];
  let gameID;
  let playerID;

  /**
   * Initializes and sets up the page.
   */
  function init() {
    fetchSprites();
  }

  /**
   * Changes the view to a pokemon battle, hides the pokedex, and reveals the
   * opposing pokemon trainer (player 2). Then enables the moves for a pokemon battle.
   * No parameters
   * No return value
   */
  function gameInit() {
    let pokemon = qs("#p1 .name").textContent;
    pokemon = trimString(pokemon);
    id("flee-btn").classList.remove("hidden");
    id("flee-btn").addEventListener("click", gamePlay);
    id("start-btn").classList.add("hidden");
    let data = new FormData();
    data.append('startgame', 'true');
    data.append('mypokemon', pokemon);
    postPoke(data);
    let moveButtons = qs("#p1 .moves").querySelectorAll("button");
    for (let i = 0; i < moveButtons.length; i++) {
      moveButtons[i].addEventListener("click", gamePlay);
      moveButtons[i].disabled = false;
    }
    switchView();
  }

  /**
   * function that fetches image information from the CSE154 with the provided
   * API (POKEMON). Catches any occuring error and outputs them through
   * console logs.
   */
  function fetchSprites() {
    fetch(BASE_URL + POKEMON)
      .then(statusCheck)
      .then(res => res.text())
      .then((response) => {
        populateDex(response);
      })
      .catch(console.error);
  }

  /**
   * Fetches the data of pokemon that have been found and selected.
   * Catches any error and logs them on console.
   * @param {Node} pokemon - node of the selected pokemon
   * No return value
   */
  function fetchPokeData(pokemon) {
    if (pokemon.classList.contains("found")) {
      fetch(BASE_URL + POKEMON_DATA + pokemon.id)
        .then(statusCheck)
        .then(res => res.json())
        .then((res) => {
          cleanCard("p1");
          pokeData(res, "p1");
          id("start-btn").classList.remove("hidden");
          id("start-btn").addEventListener("click", gameInit);
        })
        .catch(console.error);
    }
  }

  /**
   * Populates the pokedex with pokemon icons and sets the 3 default pokemon in the pokedex
   * to the Kanto starters: Bulbasaur, Charmander, and Squirtle.
   * @param {Text} response - response from the API
   * No return value
   */
  function populateDex(response) {
    response = response.trim().split(/:|\n/);
    for (let i = 1; i < response.length; i += 2) {
      let img = document.createElement("img");
      pokemons.push(response[i]);

      img.src = BASE_URL + "sprites/" + response[i] + ".png";
      img.alt = response[i - 1];
      img.classList.add("sprite");
      img.addEventListener("click", function() {
        fetchPokeData(this);
      });
      img.setAttribute('id', response[i]);

      if (response[i] === 'bulbasaur' || response[i] === 'charmander' ||
        response[i] === 'squirtle') {
        img.classList.add("found");
      }

      id("pokedex-view").appendChild(img);
    }
  }

  /**
   * Displays the pokemon data that was retrieved from fetching pokemon data.
   * @param {JSON} response - data parsed from the json file
   * @param {string} playerIDs - player number
   * No return value
   */
  function pokeData(response, playerIDs) {
    let card = id(playerIDs);
    let images = response.images;
    specificQS(playerIDs, ".name").textContent = response.name;
    specificQS(playerIDs, ".pokepic").src = BASE_URL + images.photo;
    specificQS(playerIDs, ".type").src = BASE_URL + images.typeIcon;
    specificQS(playerIDs, ".weakness").src = BASE_URL + images.weaknessIcon;
    if (response['current-hp'] || response['current-hp'] === 0) {
      specificQS(playerIDs, ".hp").textContent = response['current-hp'] + "HP";
    } else {
      specificQS(playerIDs, ".hp").textContent = response.hp + "HP";
    }
    specificQS(playerIDs, ".info").textContent = response.info.description;
    healthBarUpdate(response, card);
    moveList(response, card);
  }

  /**
   * POST operation that sends the data of mypokemon and startgame, and receives
   * Json file from the PHP server based on the sent data. Catches any errors
   * thrown and logs them on console.
   * @param {FormData} data data appended with information mypokemon and startgame
   */
  function postPoke(data) {
    fetch(BASE_URL + GAME_PHP, {method: 'POST', body: data})
      .then(statusCheck)
      .then(res => res.json())
      .then((res) => {
        gameID = res.guid;
        playerID = res.pid;
        pokeData(res.p1, "p1");
        pokeData(res.p2, "p2");
        turnResults(res.results);
        id("loading").classList.add("hidden");
      })
      .catch(console.error);
  }

  /**
   * Forms data according to if a player flees or attacks using both the game and player id.
   * While waiting for the data, plays a loading animation of pikachu running.
   * No parameters
   * No return value
   */
  function gamePlay() {
    let data = new FormData();
    let move;
    if (this.id === "flee-btn") {
      move = "flee";
    } else {
      move = this.querySelector(".move").textContent;
    }
    move = trimString(move);
    data.append('move', move);
    data.append('guid', gameID);
    data.append('pid', playerID);
    id("loading").classList.remove("hidden");
    postPoke(data);
  }

  /**
   * Initializes health bar on combat start and updates it as combat progresses.
   * Once HP falls below the 20% threshold, the HP bar turns red. Combat is ended
   * once the HP bar reaches 0.
   * @param {JSON} response - data parsed from the json file
   * @param {Node} card -  player 1/player 2 ID node
   * No return value
   */
  function healthBarUpdate(response, card) {
    const full = 100;
    const lowHP = 20;
    const faint = 0;

    if (!qs(".hp-info").classList.contains("hidden")) {
      let hpBar = card.querySelector(".health-bar");
      let currentHP = response['current-hp'] / response['hp'] * full;
      hpBar.style.width = currentHP + "%";
      if (currentHP < lowHP) {
        hpBar.classList.add("low-health");
      } else {
        hpBar.classList.remove("low-health");
      }
      if (currentHP === faint) {
        endCombat();
      }
    }
  }

  /**
   * updates the move list on the card: enables moves, shows type, and hides any
   * unused move buttons
   * @param {JSON} response - data parsed from the json file
   * @param {Node} card - player id 1/2 node
   * No return value
   */
  function moveList(response, card) {
    let moves = card.querySelector(".moves").querySelectorAll("button");
    let j = 0;
    for (let i = 0; i < response.moves.length; i++) {
      moves[i].classList.remove("hidden");
      moves[i].querySelector(".move").textContent = response.moves[i].name;
      moves[i].querySelector("img").src =
          BASE_URL + "icons/" + response.moves[i].type + ".jpg";
      if (response.moves[i].dp) {
        moves[i].querySelector(".dp").textContent = response.moves[i].dp + " DP";
      }
      j++;
    }
    for (; j < moves.length; j++) {
      moves[j].classList.add("hidden");
    }
  }

  /**
   * Displays what moves each player used. If player 2's moves is null then no text is displayed.
   * @param {JSON} response parsed JSON file received from fetch.
   * No return value
   */
  function turnResults(response) {
    if (typeof (response) !== 'undefined') {
      let p1Text = id("p1-turn-results");
      let p2Text = id("p2-turn-results");

      p1Text.classList.remove("hidden");
      p2Text.classList.remove("hidden");
      id("results-container").classList.remove("hidden");
      p1Text.textContent = "Player 1 played " + response['p1-move'] +
      " and " + response['p1-result'];
      if (response['p2-result'] !== null) {
        p2Text.textContent = "Player 2 played " +
            response['p2-move'] + " and " + response['p2-result'];
      } else {
        p2Text.classList.add("hidden");
      }
    }
  }

  /**
   * Ends the battle, switches the view back to pokedex, and awards player 1
   * the defeated pokemon if player 1 won the poke battle. If player 1 lost, then
   * the pokedex is not updated.
   * No parameters
   * No return value
   */
  function endCombat() {
    let moves = specificQS("p1", ".moves");
    disableButtons(moves);

    if (specificQS("p2", ".health-bar").style.width === "0%") {
      qs("h1").textContent = "You won!";
      let collect = trimString(specificQS("p2", ".name").textContent);
      id(collect).classList.add("found");
    } else {
      qs("h1").textContent = "You lost!";
    }

    id("flee-btn").classList.add("hidden");
    id("endgame").classList.remove("hidden");
    id("endgame").addEventListener("click", reset);
  }

  /**
   * cleans the card and resets it to all default values
   * @param {string} playerIDs - player number
   */
  function cleanCard(playerIDs) {
    let moves = specificQS(playerIDs, ".moves").querySelectorAll("button");
    let defaultIcon = BASE_URL + "icons/fighting.jpg";
    for (let x = 0; x < moves.length; x++) {
      moves[x].classList.remove("hidden");
      moves[x].querySelector(".dp").innerHTML = "";
      moves[x].querySelector(".move").textContent = "Move Name Here";
      moves[x].querySelector("img").src = defaultIcon;
    }
    disableButtons(specificQS(playerIDs, ".moves"));
    specificQS(playerIDs, ".name").textContent = "Pokemon Name";
    specificQS(playerIDs, ".type").src = BASE_URL + "icons/normal.jpg";
    specificQS(playerIDs, ".pokepic").src = BASE_URL + "images/pokeball.png";
    specificQS(playerIDs, ".weakness").src = defaultIcon;
    specificQS(playerIDs, ".hp").textContent = "60HP";
    specificQS(playerIDs, ".info").textContent = "description here";
  }

  /**
   * additional function to the endCombat function. Mainly helps to
   * remove the endgame button and show the start button, and call
   * the necessary function to maintain the current pokemon for
   * player 1.
   */
  function reset() {
    let pokemon = trimString(specificQS("p1", ".name").textContent);

    switchView();
    id("endgame").classList.add("hidden");
    id("start-btn").classList.remove("hidden");
    fetchPokeData(id(pokemon));
  }

  /**
   * Switches the view between pokedex and poke battle
   * No parameters
   * No return value
   */
  function switchView() {
    id("pokedex-view").classList.toggle("hidden");
    id("p2").classList.toggle("hidden");
    id("results-container").classList.toggle("hidden");
    qs(".hp-info").classList.toggle("hidden");
    if (!id("pokedex-view").classList.contains("hidden")) {
      qs("h1").textContent = "Your Pokedex";
    }
    if (id("pokedex-view").classList.contains("hidden")) {
      qs("h1").textContent = "Pokemon Battle!";
    }
  }

  /**
   * trims the parameter of all dots and quotation marks. Spaces are replaces with dashes.
   * The trimmed word is returned.
   * @param {String} word string to be modified
   * @returns {String} modified string
   */
  function trimString(word) {
    let newWord = word;
    newWord = newWord.toLowerCase();
    newWord = newWord.replace(/([\s)'"])+/g, '');
    newWord = newWord.replace(/([.(])+/g, '-');
    return newWord;
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
   * Helper function
   * Disables all the move buttons
   * @param {object} moves - DOM object
   * No return value
   */
  function disableButtons(moves) {
    let moveBtns = moves.querySelectorAll("button");
    for (let i = 0; i < moveBtns.length; i++) {
      moveBtns[i].disabled = true;
    }
  }

  /**
   * Helper function to get the first element of a unique object that isn't document
   * @param {string} uniqueID - element ID.
   * @param {string} selector - CSS query selector.
   * @returns {object} - DOM object associated selector.
   */
    function specificQS(uniqueID, selector) {
      return id(uniqueID).querySelector(selector);
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
})();