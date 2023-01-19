import React from "react";

import { Square } from "./Square";

export class Board extends React.Component {
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