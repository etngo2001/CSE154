/**
 * Eugene Ngo
 * December 9th
 * Section AA: Allan Tran
 * This is the yipper.js file for displaying posts on Yip, taking in user input,
 * and displaying user information by using GET and POST functions to store and
 * display client information.
 */

"use strict";

(function() {
  const BASE_URL = "/yipper";

  window.addEventListener("load", init);

  /**
   * function that loads different operations on the window's load
   */
  function init() {
    id("search-term").addEventListener('input', updateSearchBtn);
    id("search-btn").addEventListener('click', searchYip);
    fetchPosts("/yips");
    id("home-btn").addEventListener('click', resetToHome);
    id("yip-btn").addEventListener("click", newYipPage);
  }

  /**
   * Disables the search button when there is no input or only spaces. Checks the
   * requirement through regex.
   * @param {object} val - l
   * No return value
   */
  function updateSearchBtn(val) {
    let txt = val.target.value;
    if (!txt.replace(/\s/g, '').length) {
      id("search-btn").disabled = true;
    } else {
      id("search-btn").disabled = false;
    }
  }

  /**
   * Prompts the user to make a yip post and upon submission, the user's input
   * is taken in and passed to the POST function.
   * No parameters
   * No return value
   */
  function newYipPage() {
    id("home").classList.add("hidden");
    id("new").classList.remove("hidden");

    qs("form").addEventListener("submit", function(evt) {
      evt.preventDefault();

      let data = new FormData();

      data.append("name", qs("input[name='name']").value);
      data.append("full", qs("input[name='full']").value);

      newYipPost(data);
    });
  }

  /**
   * blah
   * @param {FormData} data - blah
   */
  function newYipPost(data) {
    fetch("/yipper/new", {method: 'POST', body: data})
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        handleError(false);
        prependNewYip(res);
        setTimeout(function() {
          qs("form").submit();
        }, 2000);
      })
      .catch(handleError(true));
  }

  /**
   * blah
   * @param {JSON} yip - blah
   */
  function prependNewYip(yip) {
    let post = document.createElement("artcile");
    post.classList.add("card");
    post.setAttribute('id', yip.id);

    let img = profImg(yip);
    let div1 = firstDiv(yip);
    let div2 = secondDiv(yip);

    post.appendChild(img);
    post.appendChild(div1);
    post.appendChild(div2);

    qs("input[name='name']").value = "";
    qs("input[name='full']").value = "";

    id("home").prepend(post);
  }

  /**
   * blah
   */
  function searchYip() {
    id("home").classList.remove("hidden");
    id("new").classList.add("hidden");
    id("user").classList.add("hidden");

    let url = "/yips?search=" + id("search-term").value;
    showSearch(url);
  }

  /**
   * search
   * @param {String} url - url
   */
  function showSearch(url) {
    fetch(BASE_URL + url)
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        handleError(false);
        let posts = id("home").querySelectorAll(".card");

        for (let i = 0; i < posts.length; i++) {
          posts[i].classList.add("hidden");

          for (let x = 0; x < res.yips.length; x++) {
            if (parseInt(posts[i].id) === parseInt(res.yips[x].id)) {
              posts[i].classList.remove("hidden");
            }
          }
        }
      })
      .catch(handleError(true));
  }

  /**
   * blah
   * @param {string} URL - url
   */
  function fetchPosts(URL) {
    fetch(BASE_URL + URL)
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        handleError(false);
        yipPosts(res.yips);
      })
      .catch(handleError(true));
  }

  /**
   * blah
   * @param {JSON} yips - blah
   */
  function yipPosts(yips) {
    id("home").innerHTML = "";

    for (let i = 0; i < yips.length; i++) {
      let post = document.createElement("artcile");
      post.classList.add("card");
      post.setAttribute('id', yips[i].id);

      let img = profImg(yips[i]);
      let div1 = firstDiv(yips[i]);
      let div2 = secondDiv(yips[i]);

      post.appendChild(img);
      post.appendChild(div1);
      post.appendChild(div2);

      id("home").appendChild(post);
    }
  }

  /**
   * blah
   * @param {JSON} yips - json
   * @return {object} - img
   */
  function profImg(yips) {
    let img = document.createElement("img");
    let src = yips.name.toLowerCase();

    src = src.replace(/\s+/g, "-");

    img.src = "img/" + src + ".png";
    img.alt = src;

    return img;
  }

  /**
   * blah
   * @param {JSON} yips - json
   * @returns {object} - blah
   */
  function firstDiv(yips) {
    let div1 = document.createElement("div");
    let name = document.createElement("p");
    let content = document.createElement("p");

    name.innerText = yips.name;
    name.classList.add("individual");
    name.addEventListener('click', usersYip);
    content.innerText = yips.yip + " #" + yips.hashtag;

    div1.appendChild(name);
    div1.appendChild(content);

    return div1;
  }

  /**
   * blah
   * @param {JSON} yips - json
   * @returns {object} - blah
   */
  function secondDiv(yips) {
    let div2 = document.createElement("div");
    let date = document.createElement("p");
    let heart = document.createElement("div");
    let heartImg = document.createElement("img");
    let heartNum = document.createElement("p");

    date.innerText = (new Date(yips.date)).toLocaleString();
    heartImg.src = "img/heart.png";
    heartNum.innerText = yips.likes;

    heart.appendChild(heartImg);
    heart.appendChild(heartNum);
    heartImg.addEventListener("click", likeUpdate);

    div2.appendChild(date);
    div2.appendChild(heart);
    div2.classList.add("meta");

    return div2;
  }

  /**
   * blah
   */
  function usersYip() {
    id("home").classList.add("hidden");
    id("new").classList.add("hidden");
    id('user').classList.remove("hidden");

    id("search-term").value = "";

    fetch(BASE_URL + "/user/" + this.innerText)
      .then(statusCheck)
      .then(res => res.json())
      .then(function(res) {
        handleError(false);
        usersPost(res);
      })
      .catch(handleError(true));
  }

  /**
   * mhm
   * @param {JSON} res - yea
   */
  function usersPost(res) {
    id("user").innerHTML = "";
    let num = 1;

    let article = document.createElement("article");
    let h2 = document.createElement("h2");
    article.classList.add("single");
    article.appendChild(h2);

    for (let i = 0; i < res.length; i++) {
      let para = document.createElement("p");

      h2.innerText = "Yips shared by " + res[i].name;
      para.innerText = "Yip " + num + ": " + res[i].yip + " #" + res[i].hashtag;

      article.appendChild(para);
      num += 1;
    }
    id("user").appendChild(article);
  }

  /**
   * for sth
   */
  function resetToHome() {
    let hidden = id("home").querySelectorAll(".card");

    for (let i = 0; i < hidden.length; i++) {
      hidden[i].classList.remove("hidden");
    }

    id("home").classList.remove("hidden");
    id("user").classList.add("hidden");
    id("new").classList.add("hidden");
    id("search-term").value = "";

    fetchPosts("/yips");
  }

  /**
   * id
   */
  function likeUpdate() {
    let data = new FormData();
    let parent = this.parentNode.parentNode.parentNode;
    let like = this.parentNode.querySelector("p");

    data.append('id', parent.id);

    fetch(BASE_URL + "/likes", {method: 'POST', body: data})
      .then(statusCheck)
      .then(res => res.text())
      .then(function(res) {
        handleError(false);
        like.innerText = res;
      })
      .catch(handleError(true));
  }

  /**
   * handleError(1)
   */
  function handleError(val) {
    id("yipper-data").classList.add("hidden");
    id("error").classList.remove("hidden");

    let nav = qs("nav");
    let buttons = nav.querySelectorAll("button");

    if(val) {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = true;
      }
    } else {
      for (let i = 0; i < buttons.length; i++) {
        buttons[i].disabled = false;
      }
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