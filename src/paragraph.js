export const getParagraph = (history) => {
  const history_copy = [...history];
  // isFirstMoveAndXInCorner(history);
  const isFirstMove = history_copy.length === 1;
  console.log("history", history_copy, history_copy.length);
  // if (squares.every((square) => square === null)) {
  if (isFirstMove) {
    return (
      <p>
        Tic Tac Toe—it's so simple, yet endlessly entertaining. But did you know
        that there's a mathematically proven strategy to follow that can help
        you win, or at least draw, every time you play? <br />
        That's right; you never have to lose a game of Tic Tac Toe again, and
        we'll teach you exactly how.
      </p>
    );
  }
  const currentBoard = history_copy[-1];
  const xInCorner =
    currentBoard[0] === "X" ||
    currentBoard[2] === "X" ||
    currentBoard[6] === "X" ||
    currentBoard[8] === "X";
  console.log("xInCorner", xInCorner);
};
