export const getParagraph = (history) => {
  const currentBoard = history[history.length - 1];
  const moveNumber = history.length;
  let isOInTheCenter, areXAdjacent;
  switch (moveNumber) {
    case 1:
      let paragraph = (
        <>
          <p>
            Tic Tac Toe—it's so simple, yet endlessly entertaining. But did you
            know that there's a strategy to follow that can help you win, or at
            least draw, every time you play?
          </p>
          <br />
          <p>
            That's right; you never have to lose a game of Tic Tac Toe again,
            and we'll teach you exactly how.
          </p>
        </>
      );
      return paragraph;

    case 2:
      const isXInCorner = IsPlayerInCorner(currentBoard, 1, "X");
      const isXinSide = IsXInSide(currentBoard);

      if (isXInCorner) {
        return (
          <>
            <p>
              Most experienced tic tac toe players put the first "X" in a corner
              when they get to play first.
            </p>
            <br />
            <p>
              This gives the opponent the most opportunities to make a mistake.
            </p>
            <br />
            <p>
              If your opponent responds by putting an O anywhere besides the
              center, you can guarantee a win.
            </p>
          </>
        );
      }

      if (isXinSide) {
      }

    case 3:
      const isFirstXInCorner = IsPlayerInCorner(currentBoard, 1, "X");
      isOInTheCenter = IsOInTheCenter(currentBoard);

      if (isFirstXInCorner && !isOInTheCenter) {
        return (
          <p>
            Respond by putting your second X in any other corner, with an empty
            space in between the two X's and you will win !
          </p>
        );
      }

      if (isFirstXInCorner && isOInTheCenter) {
        return (
          <>
            <p>If O continue to play correctly, a tie is guarantee.</p>
            <br />
            <p>You have to wait for O to make a mistake.</p>
          </>
        );
      }

    case 4:
      const isSecondMoveOInCenter = IsOInTheCenter(currentBoard);
      isOInTheCenter = IsOInTheCenter(currentBoard);
      areXAdjacent = AreXAdjacent(currentBoard);
      const areTwoXInCornersWithOInBetween =
        AreTwoXInCornersWithOInBetween(currentBoard);
      if (!areTwoXInCornersWithOInBetween) {
        return <p>Keep going !</p>;
      }
      if (isSecondMoveOInCenter && !areXAdjacent) {
        return <p>You can still win !</p>;
      }
    case 5:
      const isOplayedCorner = IsPlayerInCorner(currentBoard, 1, "O");
      isOInTheCenter = IsOInTheCenter(currentBoard);
      areXAdjacent = AreXAdjacent(currentBoard);
      const isOnlyOneCornerNull = IsOnlyOneCornerNull(currentBoard);
      // if (isOInTheCenter && isOplayedCorner) {
      if (isOnlyOneCornerNull) {
        return (
          <p>
            Place your third X in the last empty corner, and your opponent won't
            be able to block you from winning with your fourth X.
          </p>
        );
      }

      if (isOInTheCenter && !isOplayedCorner) {
        return (
          <p>Place your third X so you have two possible winning moves.</p>
        );
      }

    case 6:
      return <p>It's almost won</p>;
    default:
      return <p>It's a draw</p>;
  }
};

function IsPlayerInCorner(Board, requiredCount, player) {
  const xCountInCorner = [Board[0], Board[2], Board[6], Board[8]].filter(
    (element) => element === player
  ).length;

  return xCountInCorner === requiredCount;
}

function IsXInSide(Board) {
  return [Board[1], Board[3], Board[5], Board[7]].some(
    (element) => element === "X"
  );
}

function IsOInTheCenter(Board) {
  return Board[4] === "O";
}

function AreXAdjacent(Board) {
  // Trouver les indices des "X" dans la grille
  const xIndices = [];
  Board.forEach((element, index) => {
    if (element === "X") {
      xIndices.push(index);
    }
  });

  const adjacentConditions = [
    [0, 1],
    [1, 2],
    [3, 4],
    [4, 5],
    [6, 7],
    [7, 8], // Horizontalement
    [0, 3],
    [3, 6],
    [1, 4],
    [4, 7],
    [2, 5],
    [5, 8], // Verticalement
    [0, 4],
    [4, 8],
    [2, 4],
    [4, 6], // Diagonalement
  ];

  return adjacentConditions.some(
    ([index1, index2]) => xIndices.includes(index1) && xIndices.includes(index2)
  );
}

function AreTwoXInCornersWithOInBetween(Board) {
  // Trouver les indices des "X" et "O" dans la grille
  const xIndices = [];
  let oIndex = null;

  Board.forEach((element, index) => {
    if (element === "X") {
      xIndices.push(index);
    } else if (element === "O") {
      oIndex = index;
    }
  });

  // Vérifier si deux "X" sont dans les coins avec un "O" entre eux
  const cornerIndices = [0, 2, 6, 8];
  return (
    xIndices.length === 2 &&
    xIndices.every((index) => cornerIndices.includes(index)) &&
    oIndex !== null &&
    cornerIndices.includes(oIndex)
  );
}

function IsOnlyOneCornerNull(Board) {
  const cornerIndices = [0, 2, 6, 8];
  const nullCount = cornerIndices.filter(
    (index) => Board[index] === null
  ).length;
  return nullCount === 1;
}
