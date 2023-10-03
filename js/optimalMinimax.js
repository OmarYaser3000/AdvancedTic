import {
  checkForWin,
  playerMovedAllPieces,
  generateAllowedMoves,
} from "./utils";

// let calls = 0;
const Minimax = (
  board,
  player,
  playerOne,
  playerTwo,
  settings,
  playerTwoMovedPieces,
  playerOneMovedPieces,
  depth
) => {
  // console.log(`############################################################`);
  // console.log(`############################################################`);
  // console.log(`############################################################`);
  // console.log(
  //   `called ${++calls} with: \nboard: ${board}\nplayer: (${player})\nDepth: ${depth}`
  // );
  // check for ending states
  if (checkForWin(playerOne, board, settings.boardSize)) {
    if (
      playerMovedAllPieces(playerOne, playerOneMovedPieces, settings.boardSize)
    ) {
      // console.log(`Player One Won, board => ${board}`);
      return { score: -10 };
    }
  } else if (checkForWin(playerTwo, board, settings.boardSize)) {
    if (
      playerMovedAllPieces(playerTwo, playerTwoMovedPieces, settings.boardSize)
    ) {
      // console.log(`Player Two Won, board => ${board}`);
      return { score: 10 };
    }
  }

  if (depth === 0) {
    // console.log(`Did Not Find A Win!`);
    return { score: 0 };
  }
  // board = ["O", 1, "O", "O", 4, 5, "O", 7, 8, 9, 10, 11, 12, 13, 14, 15];
  // let emptyBoxes = board.filter(
  //   (item) => item != playerOne && item != playerTwo
  // );

  // creating and evaluating game branches
  let allowedMoves = generateAllowedMoves(settings.boardSize);
  let filteredMoves = [];

  if (player === playerOne) {
    let huPositions = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === playerOne) {
        huPositions.push(i);
      }
    }
    let huMoves = {};
    for (let i = 0; i < huPositions.length; i++) {
      huMoves[huPositions[i]] = allowedMoves[huPositions[i]];
    }
    for (let key in huMoves) {
      for (let i of huMoves[key]) {
        let obj = {};
        if (board[i] !== playerOne && board[i] !== playerTwo) {
          obj.from = parseInt(key);
          obj.to = i;
          filteredMoves.push(obj);
        }
      }
    }
    // console.log(`============================`);
    // console.log(`Logging from Human Player`);
    // console.log(`Positions: ${huPositions}`);
    // console.log(`Moves:`);
    // console.log(huMoves);
    // console.log(`Finally:`);
    // console.log(filteredMoves);
    // console.log(`============================`);
  } else if (player === playerTwo) {
    let aiPositions = [];
    for (let i = 0; i < board.length; i++) {
      if (board[i] === playerTwo) {
        aiPositions.push(i);
      }
    }
    let aiMoves = {};
    for (let i = 0; i < aiPositions.length; i++) {
      aiMoves[aiPositions[i]] = allowedMoves[aiPositions[i]];
    }
    for (let key in aiMoves) {
      for (let i of aiMoves[key]) {
        let obj = {};
        if (board[i] !== playerOne && board[i] !== playerTwo) {
          obj.from = parseInt(key);
          obj.to = i;
          filteredMoves.push(obj);
        }
      }
    }
    // console.log(`============================`);
    // console.log(`Logging from AI Player`);
    // console.log(`Positions: ${aiPositions}`);
    // console.log(`Moves:`);
    // console.log(aiMoves);
    // console.log(`Finally:`);
    // console.log(filteredMoves);
    // console.log(`============================`);
  }
  // console.log(
  //   ` Depth: ${depth} - Possible Moves =>`,
  //   filteredMoves,
  //   filteredMoves.length
  // );

  let moves = [];
  if (filteredMoves.length > 0) {
    for (let i of filteredMoves) {
      // console.log(i);
      let move = {};
      move.from = i.from;
      move.to = i.to;

      board[move.from] = move.from;
      board[move.to] = player;
      // console.log(`Depth: ${depth} - Board before switching players: ${board}`);

      let playerTwoMoved = [...playerTwoMovedPieces];
      let playerOneMoved = [...playerOneMovedPieces];

      if (player === playerTwo) {
        playerTwoMoved.push(i.from);
      } else {
        playerOneMoved.push(i.from);
      }

      if (player === playerTwo) {
        player = playerOne;
      } else {
        player = playerTwo;
      }

      let g = Minimax(
        board,
        player,
        playerOne,
        playerTwo,
        settings,
        playerTwoMoved,
        playerOneMoved,
        depth - 1
      );
      // console.log(`Depth: ${depth} - Minimax call returned =>`, g);
      move.score = g.score;
      // console.log(`Depth: ${depth} - Move after the Minimax call =>`, move);
      // console.log("####################################################");

      board[i.from] = player === playerOne ? playerTwo : playerOne;
      board[i.to] = i.to;

      if (player === playerTwo) {
        playerOneMoved.pop();
      } else {
        playerTwoMoved.pop();
      }
      moves.push(move);
      // console.log(`Depth : ${depth} - playerTwoMoved =>`, playerTwoMoved);
      // console.log(`Depth : ${depth} - playerOneMoved =>`, playerOneMoved);
      // console.table(moves);
      // console.log(
      //   `Call Num. ${calls} - Depth: ${depth} - Moves array => ${moves}`
      // );
      if (player === playerTwo) {
        player = playerOne;
      } else {
        player = playerTwo;
      }
      // console.log(
      //   `Depth : ${depth} - PlayerOneMovedPieces =>`,
      //   playerOneMovedPieces
      // );
      // console.log(
      //   `Depth : ${depth} - PlayerTwoMovedPieces =>`,
      //   playerTwoMovedPieces
      // );
      // console.log(`Depth : ${depth} - playerTwoMoved =>`, playerTwoMoved);
      // console.log(`Depth : ${depth} - playerOneMoved =>`, playerOneMoved);
      // console.log(`##############################################`);
    }

    let bestMove;
    if (player === playerTwo) {
      // console.log(`Depth: ${depth} - evaluating for player two...`);
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      // console.log(`Depth: ${depth} - evaluating for player one...`);
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    // console.log(`Depth: ${depth} - Will return the following move =>`);
    // console.table(moves[bestMove]);
    return moves[bestMove];
  }
  return { score: 0 };
};

export default Minimax;
