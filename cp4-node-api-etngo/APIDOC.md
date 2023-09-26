# Straw Hat Pirates API Documentation
The Straw Hat Pirates API provides information about the straw hat pirate crew sailing through the Grand Line and allows users to be able to interact with each of them individually.

## Get a lit of all the Strawhat Pirates in this service
**Request Format:** /all

**Request Type:** GET

**Returned Data Format**: Plain Text

**Description:** Returns a list of all the strawhat pirates that you can look up in this API


**Example Request:** /all

**Example Response:**
```
Luffy
Zoro
Sanji
Nami
Usopp
Chopper
Franky
Nico Robin
Brook
Jinbe
```

**Error Handling:**
- N/A

## Lookup a Pirate's Information
**Request Format:** /pirate/:name

**Request Type:** GET

**Returned Data Format**: JSON

**Description:** Given a valid pirate name, it returns a JSON of the pirate's background information. The pirate's name will be what they are most commonly referred to by others and capitilization does not matter.

**Example Request:** /pirate/Luffy

**Example Response:**
*Fill in example response in the {}*

```json
{
    "Name": "Luffy",
    "FullName": "Monkey D. Luffy",
    "Race": "Human",
    "Hometown": "Foosha Village",
    "Origin": "East Blue",
    "Crew": "Strawhats",
    "Role": "Captain",
    "DevilFruit": "Gomu Gomu no Mi",
    "DevilFruitType": "Paramecia",
    "Bounty": "3,000,000,000 Belly",
}
```

**Error Handling:**
- Possible 400 (invalid request) errors (all plain text):
  - If passed in an invalid pirate name, returns an error with the message: `We searched every nook and cranny of Sunny and could not find {name}!`
- Possible 500 errors (all plain text):
  - If something else goes wrong on the server, returns an error with the message: `Uh oh. Something went wrong. Please try again later.`