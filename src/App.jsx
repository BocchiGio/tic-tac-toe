import { useState } from 'react';
import catImg from './assets/cat.png';
import dogImg from './assets/dog.png';
import rigbyGif from './assets/rigby.gif';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value === 'cat' && <img src={catImg} alt="Cat" />}
      {value === 'dog' && <img src={dogImg} alt="Dog" />}
    </button>
  );
}

function Board({ isCatNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (isCatNext) {
      nextSquares[i] = 'cat';
    } else {
      nextSquares[i] = 'dog';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  const isDraw = !winner && squares.every((sq) => sq !== null);

  let status;
  let statusClassName = "status";

  if (winner) {
    status = 'Winner: ' + (winner === 'cat' ? 'Cat' : 'Dog');
    statusClassName = `status winner ${winner}`;
  } else if (isDraw) {
    status = 'Empate';
    statusClassName = "status draw"; 
  } else {
    status = 'Next player: ' + (isCatNext ? 'Cat' : 'Dog');
    statusClassName = "status next-player";
  }

  return (
    <>
      <div className={statusClassName}>{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

export default function App() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [purpleLightness, setPurpleLightness] = useState(40);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  const isCatNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  const easterEggPattern = ['cat', 'dog', 'cat', 'dog', 'dog', 'dog', 'cat', null, 'cat'];

  function checkForEasterEgg(squares) {
    let match = true;
    for (let i = 0; i < 9; i++) {
      if (squares[i] !== easterEggPattern[i]) {
        match = false;
        break;
      }
    }
    if (match) {
      setShowEasterEgg(true);
    }
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
    checkForEasterEgg(nextSquares);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      description = 'Movimiento #' + move;
    } else {
      description = 'Iniciar';
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  const backgroundColorStyle = {
    backgroundColor: `hsl(270, 70%, ${purpleLightness}%)`,
  };

  return (
    <div className="game-wrapper" style={backgroundColorStyle}>
      <h1>Tic-Tac-Toe</h1>

      <div className="game">
        <div className="game-board">
          <Board isCatNext={isCatNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <ol>{moves}</ol>
        </div>
      </div>

      <div className="purple-slider">
        <label>Intensidad del fondo</label>
        <input
          type="range"
          min="20"
          max="80"
          value={purpleLightness}
          onChange={(e) => setPurpleLightness(e.target.value)}
        />
      </div>

      {showEasterEgg && (
        <div className="easter-egg-modal">
          <div className="easter-egg-content">
            <h2>¡RIGBYFICADO!</h2>
            <img src={rigbyGif} className="easter-egg-gif" />
            <p>Cristian Giovany Carballo Padilla</p>
            <p>Matrícula: 73042</p>
            <button onClick={() => setShowEasterEgg(false)}>Cerrar</button>
          </div>
        </div>
      )}
    </div>
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
      return squares[a]; 
    }
  }
  return null;
}