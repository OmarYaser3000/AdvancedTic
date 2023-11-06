import "./css/style.css";
import "./css/normalize.css";
import "./css/all.min.css";

import {
  generateAllowedMoves,
  checkForWin,
  playerMovedAllPieces,
  clearGame,
} from "./js/utils";
import optimalMinimax from "./js/optimalMinimax";
import { panel } from "./js/settingsPanel";
import { tutorial } from "./js/popUps";

// testing: why this does not lead to winning?
// x,1,2,o,o,o,o,7,x,x,x,11,12,13,14,15

// themes
const themes = {
  theme01: {
    image: "./images/halloween-bg.webp",
    textColor: "#2d42df",
    color: "#1B0D04",
    gradient: `radial-gradient(circle, #f57d08 0%, #aa4a10 98%)`,
  },
  theme02: {
    image: "./images/purple.webp",
    textColor: "#0d0d2b",
    color: "#a453a1",
    gradient: `radial-gradient(circle, #9d5ead 0%, #502d59 98%)`,
  },
  theme03: {
    image: "./images/green.webp",
    textColor: "#F4C6B8",
    color: "#0d261a",
    gradient: `radial-gradient(circle, #1eb66f 0%, #184932 98%)`,
  },
  // theme04: {
  //   image: "./images/04.webp",
  //   textColor: "#07071d",
  //   color: "#4341be",
  // },
  // theme05: {
  //   image: "./images/05.webp",
  //   textColor: "#07071d",
  //   color: "#4341be",
  // },
  // theme06: {
  //   image: "./images/06.webp",
  //   textColor: "#e6ef4e",
  //   color: "#06042f",
  // },
};

// game settings
let settings = {
  boardSize: 3,
  AI: true,
  firstOpen: 0,
  compLevel: "easy",
  mode: "default",
  letter: "X",
  theme: "theme01",
};

// create the html structure
document.querySelector("#app").innerHTML = `
  <div class="container">
    <div class="board">
    </div>
  </div>
`;

// board initialization
let board;
let boxes;
let allowedMoves;

const initializeBoard = () => {
  const boardContainer = document.querySelector(".board");
  const root = document.documentElement;

  root.style.setProperty("--board-col", settings.boardSize);
  root.style.setProperty("--length", `${settings.boardSize * 100}px`);

  for (let i = 0; i < settings.boardSize ** 2; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.setAttribute("name", i);
    boardContainer.appendChild(box);
  }
  boxes = document.querySelectorAll(".box");

  board = Array.from({ length: settings.boardSize ** 2 }, (_, index) => index);
  allowedMoves = generateAllowedMoves(settings.boardSize);
};

initializeBoard();

// ###############
// main game play
// ###############

// initialize the variables
const playerOne = "X";
const playerTwo = "O";
let currentPlayer = playerOne;
let playerToMove = playerOne;
let playerOneMovedPieces = [];
let playerTwoMovedPieces = [];
let oldBox;

// initialize the players on the board
const initializePlayers = () => {
  let numberOfPieces = settings.boardSize;
  for (let i = 0; i < numberOfPieces; i++) {
    boxes[i].innerHTML = playerTwo;
    board[i] = playerTwo;
    boxes[boxes.length - i - 1].innerHTML = playerOne;
    board[boxes.length - i - 1] = playerOne;
  }
};

initializePlayers();

document.addEventListener("click", (e) => {
  if (
    e.target.classList.contains("box") &&
    e.target.innerHTML === playerOne &&
    playerToMove === playerOne
  ) {
    currentPlayer = playerOne;
    oldBox = parseInt(e.target.getAttribute("name"));
    // remove the highlights from all boxes
    boxes.forEach((item) => {
      item.classList.remove("highlighted");
    });
    // highlight the available moves to the selected piece
    let allowedList = allowedMoves[parseInt(e.target.getAttribute("name"))];
    for (let i = 0; i < allowedList.length; i++) {
      if (boxes[allowedList[i]].innerHTML === "") {
        boxes[allowedList[i]].classList.add("highlighted");
      }
    }
  }

  // player two in local play
  if (
    e.target.classList.contains("box") &&
    e.target.innerHTML === playerTwo &&
    !settings.AI &&
    playerToMove === playerTwo
  ) {
    currentPlayer = playerTwo;
    oldBox = parseInt(e.target.getAttribute("name"));
    // remove the highlights from all boxes
    boxes.forEach((item) => {
      item.classList.remove("highlighted");
    });
    // highlight the available moves to the selected piece
    let allowedList = allowedMoves[parseInt(e.target.getAttribute("name"))];
    for (let i = 0; i < allowedList.length; i++) {
      if (boxes[allowedList[i]].innerHTML === "") {
        boxes[allowedList[i]].classList.add("highlighted");
      }
    }
    // check for a winning for the player if he already moved all his pieces
    if (
      playerMovedAllPieces(playerTwo, playerTwoMovedPieces, settings.boardSize)
    ) {
      if (checkForWin(playerTwo, board, settings.boardSize)) {
        alert(`${playerTwo} Wins!`);
        boardContainer.innerHTML = "";
        clearGame(boxes, board, playerOneMovedPieces, playerTwoMovedPieces);
        initializeBoard();
        initializePlayers();
      }
    }
  }

  // checking if the player clicked on a valid box and updating the board array and DOM
  if (
    e.target.classList.contains("box") &&
    e.target.innerHTML === "" &&
    e.target.classList.contains("highlighted")
  ) {
    e.target.innerHTML = currentPlayer;
    board[parseInt(e.target.getAttribute("name"))] = currentPlayer;
    board[oldBox] = oldBox;
    boxes[oldBox].innerHTML = "";
    let playerMovedPieces =
      currentPlayer === playerOne ? playerOneMovedPieces : playerTwoMovedPieces;
    playerMovedPieces.push(oldBox);
    // remove the highlights from all boxes
    boxes.forEach((item) => {
      item.classList.remove("highlighted");
    });
    playerToMove = playerToMove === playerOne ? playerTwo : playerOne;
    // check for a winning for the player if he already moved all his pieces
    if (
      playerMovedAllPieces(currentPlayer, playerMovedPieces, settings.boardSize)
    ) {
      if (checkForWin(currentPlayer, board, settings.boardSize)) {
        alert(`${currentPlayer} Wins!`);
        boardContainer.innerHTML = "";
        clearGame(boxes, board, playerOneMovedPieces, playerTwoMovedPieces);
        initializeBoard();
        initializePlayers();
      }
    }

    // checking if the AI mode is active and returning its value
    if (settings.AI && playerOneMovedPieces.length >= 1) {
      let aiRes = optimalMinimax(
        board,
        playerTwo,
        playerOne,
        playerTwo,
        settings,
        playerTwoMovedPieces,
        playerOneMovedPieces,
        7
      );
      board[aiRes.from] = parseInt(aiRes.from);
      board[aiRes.to] = playerTwo;
      boxes[aiRes.from].innerHTML = "";
      boxes[aiRes.to].innerHTML = playerTwo;
      playerTwoMovedPieces.push(aiRes.from);
      if (
        playerMovedAllPieces(
          playerTwo,
          playerTwoMovedPieces,
          settings.boardSize
        )
      ) {
        if (checkForWin(playerTwo, board, settings.boardSize)) {
          alert(`${playerTwo} Wins!`);
          boardContainer.innerHTML = "";
          clearGame(boxes, board, playerOneMovedPieces, playerTwoMovedPieces);
          initializeBoard();
          initializePlayers();
        }
      }

      playerToMove = playerOne;
    }
  }
});

// add settings panel to the app
const appElement = document.querySelector(".container");
const panelContainer = document.createElement("div");
panelContainer.classList.add("settings-container");

panelContainer.innerHTML = panel;

appElement.insertBefore(panelContainer, appElement.firstChild);

// add popups to the game
const tutorialPopup = document.createElement("div");
tutorialPopup.id = "tutorial";
tutorialPopup.classList.add("popup");
tutorialPopup.classList.add("tutorial");
tutorialPopup.innerHTML = tutorial;
appElement.append(tutorialPopup);

// add popup button actions
const tutorialBtn = document.querySelector(".tutorial-btn");
const tutorialPopupId = document.getElementById("tutorial");

tutorialBtn.addEventListener("click", () => {
  const tutorialContent = document.querySelector(".tutorial-content");
  tutorialPopupId.style.animationName = "popupDisappear";
  tutorialPopupId.style.animationDuration = ".5s";

  tutorialPopupId.addEventListener("animationend", () => {
    tutorialPopupId.style.display = "none";
  });
});

// importing dom elements
const root = document.documentElement;
const settingsBtn = document.querySelector(".settings-btn");
const settingsSection = document.querySelector(".settings-container");
const selects = document.querySelectorAll("select");
const bg = document.querySelector(".container");
const boardContainer = document.querySelector(".board");
const tutorialContent = document.querySelector(".tutorial-content");

// adjusting game theme
const adjustTheme = () => {
  let currentTheme = settings.theme;
  bg.style.backgroundImage = `url(${themes[currentTheme].image})`;
  root.style.setProperty("--main-color", themes[currentTheme].color);
  root.style.setProperty("--text-color", themes[currentTheme].textColor);
  tutorialContent.style.background = `${themes[currentTheme].gradient}`;
};

// set the settings to and from local storage
let settingsArr = Object.keys(settings);

if (localStorage.getItem("firstOpen") === null) {
  settingsArr.forEach((item) => {
    if (item === "boardSize") {
      localStorage.setItem("boardSize", `${settings.boardSize}`);
    }
    if (item === "AI" && settings[item] === true) {
      localStorage.setItem("AI", `true`);
    } else if (item === "AI" && settings[item] === false) {
      localStorage.setItem("AI", "false");
    }
    localStorage.setItem(item, settings[item]);
  });
  tutorialPopup.classList.toggle("popup");
  localStorage.setItem("firstOpen", 1);
  adjustTheme();
  initializePlayers();
} else {
  settingsArr.forEach((item) => {
    let val = localStorage.getItem(item);
    if (item === "boardSize") {
      settings.boardSize = parseInt(val);
      selects.forEach((select) => {
        if (select.name === "boardSize") {
          select.value = val;
        }
      });
    } else if (item === "AI" && val === "true") {
      settings[item] = true;
      selects.forEach((select) => {
        if (select.name === "opponent") {
          select.value = "comp";
        }
      });
    } else {
      settings[item] = val;
      selects.forEach((select) => {
        if (select.name === item) {
          select.value = val;
        }
      });
    }
  });
  boardContainer.innerHTML = "";
  clearGame(boxes, board, playerOneMovedPieces, playerTwoMovedPieces);
  initializeBoard();
  adjustTheme();
  initializePlayers();
}

// changing localStorage & settings values on selection & update game theme
selects.forEach((select) => {
  select.addEventListener("change", (e) => {
    localStorage.setItem(select.name, select.value);
    if (select.name === "boardSize") {
      settings[select.name] = parseInt(select.value);
    } else if (select.name === "opponent" && select.value === "comp") {
      settings.AI = true;
    } else if (select.name === "opponent" && select.value !== "comp") {
      settings.AI = false;
    } else {
      settings[select.name] = select.value;
    }
    clearGame(boxes, board, playerOneMovedPieces, playerTwoMovedPieces);
    boardContainer.innerHTML = "";
    initializeBoard();
    adjustTheme();
    initializePlayers();
    playerToMove = playerOne;
  });
});

// toggle settings and change appearance accordingly

const settingsPanel = document.querySelector(".settings");
const width = settingsPanel.offsetWidth;
settingsSection.style.left = `${-width}px`;

settingsBtn.addEventListener("click", () => {
  if (settingsSection.style.left === "0px") {
    settingsSection.style.left = `${-width}px`;
    if (window.innerWidth > 992) {
      boardContainer.style.transform = `translateX(${-width / 4}px)`;
    }
  } else if (settingsSection.style.left === `${-width}px`) {
    settingsSection.style.left = "0px";
    if (window.innerWidth > 992) {
      boardContainer.style.transform = `translateX(${width / 2}px)`;
    }
  }
});
