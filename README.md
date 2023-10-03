## Game Rules

- This is a more strategic version of tic tac toe.
- You should make a row, column, or a diagonal with your pieces.
- You can win after all of your pieces are moved at least once.
-

## About The Diagram

- I colored the outline of the minimax algorithm just for convenience.
- I colored the arrows that span long distances just for convenience.
- The Minimax implementation in the chart represents only the optimal algorithm, for other variations refer to the Minimax section.

## Current Issues

- In boards larger than 3, there is the issue that the player can win by moving all his pieces in the row directly above.
  - Increasing the depth of the search makes the application very slow.
  - We better optimize for this case specifically by prioritizing moves that block this case if no better moves are available.
