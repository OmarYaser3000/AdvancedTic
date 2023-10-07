// ###########################
// allowed moves
export const generateAllowedMoves = (boardSize) => {
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

// ###########################
// checking for winning states
export function checkForWin(player, board, boardSize) {
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

// ########################
// checking if the player moved all of his pieces
export const playerMovedAllPieces = (player, playerPieces, boardSize) => {
  let counter = 0;
  let arr = Array.from({ length: boardSize ** 2 }, (_, index) => {
    return index;
  });

  let requiredBoxes;
  if (player === "X") {
    requiredBoxes = arr.slice(-boardSize);
  } else {
    requiredBoxes = arr.slice(0, boardSize);
  }
  requiredBoxes.forEach((item) => {
    if (playerPieces.includes(item)) counter++;
  });
  if (counter === boardSize) return true;
  return false;
};

// ########################
// Clearing the game
export const clearGame = (
  boxes,
  board,
  playerOneMovedPieces,
  playerTwoMovedPieces
) => {
  for (let i = 0; i < boxes.length; i++) {
    boxes[i].innerHTML = "";
    board[i] = "";
  }
  playerOneMovedPieces = [];
  playerTwoMovedPieces = [];
};

// ########################
// initialize the players on the board
// export const initializePlayers = (
//   settings,
//   board,
//   boxes,
//   playerOne,
//   playerTwo
// ) => {
//   let numberOfPieces = settings.boardSize;
//   for (let i = 0; i < numberOfPieces; i++) {
//     boxes[i].innerHTML = playerTwo;
//     board[i] = playerTwo;
//     boxes[boxes.length - i - 1].innerHTML = playerOne;
//     board[boxes.length - i - 1] = playerOne;
//   }
// };

// ########################
// board initialization
// export const initializeBoard = (settings) => {
//   const board = document.querySelector(".board");
//   const root = document.documentElement;

//   root.style.setProperty("--board-col", settings.boardSize);
//   root.style.setProperty("--length", `${settings.boardSize * 100}px`);

//   for (let i = 0; i < settings.boardSize ** 2; i++) {
//     const box = document.createElement("div");
//     box.classList.add("box");
//     box.setAttribute("name", i);
//     board.appendChild(box);
//   }
// };
