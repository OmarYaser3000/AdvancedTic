import "./css/style.css";

// game settings
let settings = {
  boardSize: 3,
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
const playerOne = "X";
const playerTwo = "O";
let playerOneMovedPieces = 0;
let playerTwoMovedPieces = 0;
let currentPlayer = playerOne;

// initialize the players on the board
let numberOfPieces = settings.boardSize;
for (let i = 0; i < numberOfPieces; i++) {
  boxes[i].innerHTML = playerTwo;
  board[i] = playerTwo;
  boxes[boxes.length - i - 1].innerHTML = playerOne;
  board[boxes.length - i - 1] = playerOne;
}

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("box") && e.target.innerHTML === "") {
    console.log(e.target.getAttribute("name"));
  }
});
