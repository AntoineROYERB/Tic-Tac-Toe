import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getParagraph } from "./paragraph";

function Board({ xIsNext, squares, onPlay, win }) {
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

  // const win = calculateWinner(squares);
  // const isDraw = squares.every((element) => element !== null);
  // let status;
  // if (!!win) {
  //   status = "Winner: " + win.winner;
  // } else if (isDraw) {
  //   status = "Draw match";
  // } else if (!win) {
  //   status = "Next player: " + (xIsNext ? "X" : "O");
  // }

  return (
    <>
      {/* <div className="status">{status}</div> */}
      <div className="board">
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
      </div>
    </>
  );
}

function History() {
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
  return (
    <>
      <ToggleButton value="order" onChange={() => setIsToggle(!isToggle)}>
        {/* {isToggle ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />} */}
      </ToggleButton>
      <ol>{moves}</ol>
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentBoard = history[currentMove];
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

  // Resets only if a winner is present or the match is drawn
  function handleRestart() {
    const win = calculateWinner(currentBoard);
    const isDraw = currentBoard.every((element) => element !== null);

    if (win || isDraw) {
      setHistory([Array(9).fill(null)]);
      setCurrentMove(0);
    }
  }

  let paragraph;
  let finalMessageSent;
  if (!finalMessageSent) {
    paragraph = getParagraph(history);
    if (paragraph.props.children.toString() == "It's a draw") {
      finalMessageSent = "draw";
    }
    if (paragraph.props.children.toString() == "It's almost won") {
      finalMessageSent = "It's almost won";
    }
  } else if (finalMessageSent == "draw") {
    paragraph = <p>It's a draw</p>;
  } else if (finalMessageSent == "It's almost won") {
    paragraph = <p>It's almost won</p>;
  }

  const win = calculateWinner(currentBoard);
  if (win) {
    paragraph = <p>Well played !</p>;
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

  if (!isToggle) {
    moves.reverse();
  }

  // const win = calculateWinner(squares);
  const isDraw = currentBoard.every((element) => element !== null);
  let status;
  if (!!win) {
    status = "Winner: " + win.winner;
  } else if (isDraw) {
    status = "Draw match";
  } else if (!win) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <>
      <div className="game">
        <div className="game-history">
          <ToggleButton value="order" onChange={() => setIsToggle(!isToggle)}>
            {isToggle ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
          </ToggleButton>
          <ol>{moves}</ol>
        </div>
        {/* 
        <div className="game-history">
          <History />
        </div> */}
        <div className="game-board" onClick={handleRestart}>
          <div className="status">{status}</div>
          <Board
            xIsNext={xIsNext}
            squares={currentBoard}
            onPlay={handlePlay}
            win={win}
          />
        </div>

        <div className="game-text">{paragraph}</div>
      </div>
    </>
  );
}

function Square({ value, onSquareClick, isWinnerSquare }) {
  const squareClassName = isWinnerSquare ? "square winner" : "square";

  return (
    <button className={squareClassName} onClick={onSquareClick}>
      {value}
    </button>
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
