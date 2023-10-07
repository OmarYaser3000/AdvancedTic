import "./css/style.css";
import {
  generateAllowedMoves,
  checkForWin,
  playerMovedAllPieces,
  clearGame,
} from "./js/utils";
import optimalMinimax from "./js/optimalMinimax";

// testing: why this does not lead to winning?
// x,1,2,o,o,o,o,7,x,x,x,11,12,13,14,15

// game settings
let settings = {
  boardSize: 3,
  AI: true,
};

// create the html structure
document.querySelector("#app").innerHTML = `
  <div class="container">
    <div class="board">
    </div>
  </div>
`;

// board initialization
const initializeBoard = () => {
  const board = document.querySelector(".board");
  const root = document.documentElement;

  root.style.setProperty("--board-col", settings.boardSize);
  root.style.setProperty("--length", `${settings.boardSize * 100}px`);

  for (let i = 0; i < settings.boardSize ** 2; i++) {
    const box = document.createElement("div");
    box.classList.add("box");
    box.setAttribute("name", i);
    board.appendChild(box);
  }
};

initializeBoard();

// ###############
// main game play
// ###############

const boxes = document.querySelectorAll(".box");

// initialize the variables
let board = Array.from(
  { length: settings.boardSize ** 2 },
  (_, index) => index
);
const allowedMoves = generateAllowedMoves(settings.boardSize);
const playerOne = "X";
const playerTwo = "O";
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
  if (e.target.classList.contains("box") && e.target.innerHTML === playerOne) {
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

  // checking if the player clicked on a valid box and updating the board array and DOM
  if (
    e.target.classList.contains("box") &&
    e.target.innerHTML === "" &&
    e.target.classList.contains("highlighted")
  ) {
    e.target.innerHTML = playerOne;
    board[parseInt(e.target.getAttribute("name"))] = playerOne;
    board[oldBox] = oldBox;
    boxes[oldBox].innerHTML = "";
    playerOneMovedPieces.push(oldBox);
    // remove the highlights from all boxes
    boxes.forEach((item) => {
      item.classList.remove("highlighted");
    });
    // check for a winning for the player if he already moved all his pieces
    if (
      playerMovedAllPieces(playerOne, playerOneMovedPieces, settings.boardSize)
    ) {
      if (checkForWin(playerOne, board, settings.boardSize)) {
        alert(`${playerOne} Wins!`);
        clearGame(boxes, board, playerOneMovedPieces, playerTwoMovedPieces);
        initializePlayers();
      }
    }

    // checking if the AI mode is active and returning its value
    if (settings.AI) {
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
          clearGame(boxes, board, playerOneMovedPieces, playerTwoMovedPieces);
          initializePlayers();
        }
      }
    }
  }
});
