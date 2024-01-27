import { useState } from "react";
import Switch from "@mui/material/Switch";

function Square({ value, onSquareClick, isWinnerSquare }) {
  const squareClassName = isWinnerSquare ? "square winner" : "square";

  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function renderSquare(i, isWinnerSquare) {
    return (
      <Square
        key={i}
        value={squares[i]}
        onSquareClick={() => handleClick(i)}
        isWinnerSquare={isWinnerSquare}
      />
    );
  }

  function handleClick(i) {
    const win = calculateWinner(squares);
    if ((win && win.winner) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const win = calculateWinner(squares);
  const isDraw = squares.every((element) => element !== null);
  let status;
  if (win && win.winner) {
    status = "Winner: " + win.winner;
  }
  if (isDraw) {
    status = "Draw match";
  } else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  return (
    <>
      <div className="status">{status}</div>
      {Array(3)
        .fill(null)
        .map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {Array(3)
              .fill(null)
              .map((col, colIndex) => {
                const squareIndex = rowIndex * 3 + colIndex;
                const isWinnerSquare =
                  win && win.winningPosition.includes(squareIndex);
                return renderSquare(squareIndex, isWinnerSquare);
              })}
          </div>
        ))}
    </>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], winningPosition: [a, b, c] };
    }
  }
  return null;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [isToggle, setIsToggle] = useState(true);

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function findLastMove(previousList, currentList) {
    for (let i = 0; i < currentList.length; i++) {
      if (previousList[i] !== currentList[i]) {
        return i;
      }
    }
    // If no move is found, return the index of the last element
    return currentList.length - 1;
  }
  const moves = history.map((squares, move) => {
    let description;
    if (move > 0 && move < currentMove) {
      const lastMoveIndex = findLastMove(history[move - 1], history[move]);
      if (lastMoveIndex !== -1) {
        const row = Math.floor(lastMoveIndex / 3) + 1;
        const col = (lastMoveIndex % 3) + 1;
        description = `Go to move #${move} (${row}, ${col})`;
      } else {
        description = `Go to move #${move}`;
      }
    } else if (move === currentMove) {
      description = "You are at move #" + move;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if (isToggle) {
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-info">
        <Switch onChange={() => setIsToggle(!isToggle)} />
        <ol>{moves}</ol>
      </div>
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div id="texte-droite">
        <p>
          Ut enim quisque sibi plurimum confidit et ut quisque maxime virtute et
          sapientia sic munitus est, ut nullo egeat suaque omnia in se ipso
          posita iudicet, ita in amicitiis expetendis colendisque maxime
          excellit. Quid enim? Africanus indigens mei? Minime hercule! ac ne ego
          quidem illius; sed ego admiratione quadam virtutis eius, ille vicissim
          opinione fortasse non nulla, quam de meis moribus habebat, me dilexit;
          auxit benevolentiam consuetudo. Sed quamquam utilitates multae et
          magnae consecutae sunt, non sunt tamen ab earum spe causae diligendi
          profectae.
        </p>
      </div>
    </div>
  );
}
