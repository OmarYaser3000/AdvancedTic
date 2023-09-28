## Game Rules

- This is a more strategic version of tic tac toe.
- You should make a row, column, or a diagonal with your pieces.
- You can win after all of your pieces are moved at least once.
-

- I colored the outline of the minimax algorithm just for convenience.
- I colored the arrows that span long distances just for convenience.
- The Minimax implementation in the chart represents only the optimal algorithm, for other variations refer to the Minimax section.

```js
function minimax(newBoard, player) {
  let availSpots = newBoard.filter((s) => s != "X" && s != "O");

  if (checkForWin(newBoard, playerOne)) {
    return { score: -10 };
  } else if (checkForWin(newBoard, playerTwo)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }

  let moves = [];

  for (let i = 0; i < availSpots.length; i++) {
    let move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player === playerTwo) {
      let g = minimax(newBoard, playerOne);
      move.score = g.score;
    } else {
      let g = minimax(newBoard, playerTwo);
      move.score = g.score;
    }

    newBoard[availSpots[i]] = move.index;
    moves.push(move);
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
```
