import {
  checkForWin,
  playerMovedAllPieces,
  generateAllowedMoves,
} from "./utils";

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
  // check for ending states
  if (checkForWin(playerOne, board, settings.boardSize)) {
    if (
      playerMovedAllPieces(playerOne, playerOneMovedPieces, settings.boardSize)
    ) {
      return { score: -10 };
    }
  } else if (checkForWin(playerTwo, board, settings.boardSize)) {
    if (
      playerMovedAllPieces(playerTwo, playerTwoMovedPieces, settings.boardSize)
    ) {
      return { score: 10 };
    }
  }

  if (depth === 0) {
    return { score: 0 };
  }

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
  }

  let moves = [];
  if (filteredMoves.length > 0) {
    for (let i of filteredMoves) {
      let move = {};
      move.from = i.from;
      move.to = i.to;

      board[move.from] = move.from;
      board[move.to] = player;

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
      move.score = g.score;

      board[i.from] = player === playerOne ? playerTwo : playerOne;
      board[i.to] = i.to;

      if (player === playerTwo) {
        playerOneMoved.pop();
      } else {
        playerTwoMoved.pop();
      }
      moves.push(move);
      if (player === playerTwo) {
        player = playerOne;
      } else {
        player = playerTwo;
      }
    }

    let bestMove;
    if (player === playerTwo) {
      let bestScore = -Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = i;
        }
      }
    }

    return moves[bestMove];
  }
  return { score: 0 };
};

export default Minimax;
