export default function Button({ text = "", onClick = () => {} }) {
  return (
    <button onClick={onClick} type="submit" className="kEqtXm">
      {text}
    </button>
  );
}
