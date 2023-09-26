/*
 * Eugene Ngo
 * November 27 2022
 * Section AA: Allan Tran
 *
 * This is the app.js for my One Piece page which provides information on each of the Straw Hat
 * Pirates
 */

"use strict";

const fs = require("fs").promises;
const express = require("express");
const app = express();

const INVALID_PARAM_ERROR = 400;

// displays list of all pirates in the database
app.get("/all", async function(req, res) {
  try {
    let list = await fs.readFile("strawhats.json", "utf8");
    list = JSON.parse(list);
    res.json(list);
  } catch (err) {
    res.type("text");
    res.send("An error has occurred: " + err);
  }
});

// displays a user-selected pirate from the database
app.get("/pirate/:name", async function(req, res) {
  let name = req.params.name;
  try {
    let list = await fs.readFile("strawhats.json", "utf8");
    let pirates = JSON.parse(list).pirates;
    let pirate;
    for (let i = 0; i < pirates.length; i++) {
      pirate = pirates[i].name;
      if (pirate.toLowerCase() === name.toLowerCase()) {
        res.json(pirates[i]);
        return;
      }
    }
    res.status(INVALID_PARAM_ERROR).send("We searched every nook and cranny of Sunny and" +
      "could not find " + name + "!");
  } catch (err) {
    res.type("text");
    res.status(INVALID_PARAM_ERROR).send("Uh oh. Something went wrong. Please try again later.");
  }
});

app.use(express.static("public"));

const PORT = process.env.PORT || 8000;
app.listen(PORT);