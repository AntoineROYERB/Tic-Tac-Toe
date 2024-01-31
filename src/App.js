import { useState } from "react";
import ToggleButton from "@mui/material/ToggleButton";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { getParagraph } from "./paragraph";

function Board({ xIsNext, squares, onPlay, gameInfo }) {
  function renderSquare(squareIndex, isWinnerSquare) {
    return (
      <Square
        key={squareIndex}
        value={squares[squareIndex]}
        onSquareClick={() => handleClick(squareIndex)}
        isWinnerSquare={isWinnerSquare}
      />
    );
  }

  function handleClick(squareIndex) {
    console.log("squares", squares);
    if ((gameInfo && gameInfo.winner) || squares[squareIndex]) {
      return;
    }

    const nextSquares = squares.slice();

    if (xIsNext) {
      nextSquares[squareIndex] = "X";
    } else {
      nextSquares[squareIndex] = "O";
    }
    onPlay(nextSquares);
  }
  console.log("gameInfo:", gameInfo);
  return (
    <>
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
                    gameInfo &&
                    gameInfo.winningPosition &&
                    gameInfo.winningPosition.includes(squareIndex);

                  return renderSquare(squareIndex, isWinnerSquare);
                })}
            </div>
          ))}
      </div>
    </>
  );
}

function History({ onJumpTo, gameHistory, currentMove }) {
  const [isToggle, setIsToggle] = useState(true);

  function findLastMove(previousList, currentList) {
    for (let i = 0; i < currentList.length; i++) {
      if (previousList[i] !== currentList[i]) {
        return i;
      }
    }
    // If no move is found, return the index of the last element
    return currentList.length - 1;
  }

  function handleClick(moveIndex) {
    onJumpTo(moveIndex);
  }

  const movesDescription = gameHistory.map((_, moveIndex) => {
    let description;
    if (moveIndex > 0 && moveIndex < currentMove) {
      const lastMoveIndex = findLastMove(
        gameHistory[moveIndex - 1],
        gameHistory[moveIndex]
      );
      if (lastMoveIndex !== -1) {
        const row = Math.floor(lastMoveIndex / 3) + 1;
        const col = (lastMoveIndex % 3) + 1;
        description = `Go to move #${moveIndex} (${row}, ${col})`;
      } else {
        description = `Go to move #${moveIndex}`;
      }
    } else if (moveIndex === currentMove) {
      description = "You are at move #" + moveIndex;
    } else {
      description = "Go to game start";
    }

    return (
      <li key={moveIndex}>
        <button onClick={() => handleClick(moveIndex)}>{description}</button>
      </li>
    );
  });

  if (!isToggle) {
    movesDescription.reverse();
  }
  return (
    <>
      <ToggleButton value="order" onChange={() => setIsToggle(!isToggle)}>
        {isToggle ? <KeyboardArrowDownIcon /> : <KeyboardArrowUpIcon />}
      </ToggleButton>
      <ol>{movesDescription}</ol>
    </>
  );
}

function Paragraph({ gameHistory, gameInfo }) {
  let paragraph;
  let finalMessageSent;
  if (!finalMessageSent) {
    paragraph = getParagraph(gameHistory);
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

  if (gameInfo) {
    paragraph = <p>Well played !</p>;
  }

  return <>{paragraph}</>;
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);

  const xIsNext = currentMove % 2 === 0;
  const currentBoard = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function handleJumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  // Resets only if a winner is present or the match is drawn
  function handleRestart() {
    if (gameInfo) {
      setHistory([Array(9).fill(null)]);
      setCurrentMove(0);
    }
  }

  const gameInfo = getGameInfo(currentBoard);

  let status;
  if (!!gameInfo) {
    if (gameInfo.winner) status = "Winner: " + gameInfo.winner;
    else if (gameInfo.isDraw) {
      status = "Draw match";
    }
  } else if (!gameInfo) {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }
  return (
    <>
      <div className="game">
        <History
          onJumpTo={handleJumpTo}
          gameHistory={history}
          currentMove={currentMove}
          squares={currentBoard}
        />
        <div className="game-status-board" onClick={handleRestart}>
          <div className="status">{status}</div>
          <Board
            xIsNext={xIsNext}
            squares={currentBoard}
            onPlay={handlePlay}
            gameInfo={gameInfo}
          />
        </div>
        <Paragraph gameHistory={history} gameInfo={gameInfo} />
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

function getGameInfo(squares) {
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
      return { winner: squares[a], winningPosition: [a, b, c], isDraw: false };
    }
  }
  const isDraw = squares.every((element) => element !== null);
  if (isDraw) return { winner: null, winningPosition: null, isDraw: true };
  else return null;
}
