export function Square(props) {
  return (
    <button
      className={"square " + (props.isWinning ? "winning-square" : null)}
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
}