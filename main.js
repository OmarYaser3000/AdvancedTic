import "./css/style.css";

// game settings
let settings = {
  boardSize: 3,
};

// allowed moves
const generateAllowedMoves = (boardSize) => {
  const allowed = {};

  for (let i = 0; i < boardSize * boardSize; i++) {
    const neighbors = [];

    // Check left neighbor
    if (i % boardSize !== 0) {
      neighbors.push(i - 1);
    }

    // Check right neighbor
    if (i % boardSize !== boardSize - 1) {
      neighbors.push(i + 1);
    }

    // Check top neighbor
    if (i >= boardSize) {
      neighbors.push(i - boardSize);
    }

    // Check bottom neighbor
    if (i < boardSize * (boardSize - 1)) {
      neighbors.push(i + boardSize);
    }

    allowed[i] = neighbors;
  }

  return allowed;
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
let currentPlayer = playerOne;
let oldBox;

// initialize the players on the board
let numberOfPieces = settings.boardSize;
for (let i = 0; i < numberOfPieces; i++) {
  boxes[i].innerHTML = playerTwo;
  board[i] = playerTwo;
  boxes[boxes.length - i - 1].innerHTML = playerOne;
  board[boxes.length - i - 1] = playerOne;
}

document.addEventListener("click", (e) => {
  // const clickedBox = parseInt(e.target.getAttribute("name"));

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
    if (
      playerOneMovedPieces.includes(6) &&
      playerOneMovedPieces.includes(7) &&
      playerOneMovedPieces.includes(8)
    ) {
      // checkForWin()
      console.log("winnable");
    }
    // remove the highlights from all boxes
    boxes.forEach((item) => {
      item.classList.remove("highlighted");
    });
  }
});
