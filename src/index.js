import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "winning-squares" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}

function SortButton(props) {
  return (
    <button className="sort" onClick={props.onClick}>
      {"Sort"}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        isWinning={this.props.winCondition.includes(i)}
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  renderRowSquares(rowNumber) {
    return [...Array(3).keys()].map((i) =>
      this.renderSquare(i + rowNumber * 3)
    );
  }

  renderRows() {
    let rows = [];
    for (let i = 0; i < 3; i++) {
      rows.push(
        <div key={i} className="board-row">
          {this.renderRowSquares(i)}
        </div>
      );
    }
    return rows;
  }

  render() {
    return <div>{this.renderRows()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      stepNumber: 0,
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares,
          location: i,
        },
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  toggleSort() {
    this.setState((prevState) => ({
      isDescending: !prevState.isDescending,
    }));
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            {move === this.state.stepNumber ? <b>{desc}</b> : desc}
          </button>{" "}
          {move > 0 && (
            <span>
              Player {move % 2 === 0 ? "O" : "X"}:
              {(history[move].location % 3) + 1},
              {Math.ceil((history[move].location + 1) / 3)}
            </span>
          )}
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner.user;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            winCondition={winner ? winner.line : []}
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <SortButton onClick={() => this.toggleSort()} />
          <ol>{this.state.isDescending ? moves.reverse() : moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

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
      return { user: squares[a], line: [a, b, c] };
    }
  }
  return null;
}
