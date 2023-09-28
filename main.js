import "./css/style.css";

// game settings
let settings = {
  boardSize: 4,
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
    // remove the highlights from all boxes
    boxes.forEach((item) => {
      item.classList.remove("highlighted");
    });
    // check for a winning for the player if he already moved all his pieces
    if (playerMovedAllPieces(playerOneMovedPieces, settings.boardSize)) {
      if (checkForWin(playerOne, board, settings.boardSize)) {
        console.log(`${playerOne} Wins!`);
      }
    }
  }
});

// ###########################
// checking for winning states
function checkForWin(player, board, boardSize) {
  // Check rows
  for (let row = 0; row < boardSize; row++) {
    let rowCount = 0;
    for (let col = 0; col < boardSize; col++) {
      if (board[row * boardSize + col] === player) {
        rowCount++;
      }
    }
    if (rowCount === boardSize) {
      return true;
    }
  }
  // Check columns
  for (let col = 0; col < boardSize; col++) {
    let colCount = 0;
    for (let row = 0; row < boardSize; row++) {
      if (board[row * boardSize + col] === player) {
        colCount++;
      }
    }
    if (colCount === boardSize) {
      return true;
    }
  }
  // Check diagonals
  let diagonal1Count = 0;
  let diagonal2Count = 0;
  for (let i = 0; i < boardSize; i++) {
    if (board[i * boardSize + i] === player) {
      diagonal1Count++;
    }
    if (board[i * boardSize + (boardSize - 1 - i)] === player) {
      diagonal2Count++;
    }
  }
  if (diagonal1Count === boardSize || diagonal2Count === boardSize) {
    return true;
  }

  return false;
}

// checkForWin(playerOne, board, settings.boardSize);

// ########################
// checking if the player moved all of his pieces
const playerMovedAllPieces = (playerOneMovedPieces, boardSize) => {
  let counter = 0;
  let arr = Array.from({ length: boardSize ** 2 }, (_, index) => {
    return index;
  });
  let requiredBoxes = arr.slice(-boardSize);
  requiredBoxes.forEach((item) => {
    if (playerOneMovedPieces.includes(item)) counter++;
  });
  if (counter === boardSize) return true;
};
