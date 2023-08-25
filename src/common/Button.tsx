export default function Button({ text = "", onClick = () => {} }) {
  return (
    <button
      onClick={onClick}
      type="submit"
      className="rounded-md bg-sky-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-sky-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-600"
    >
      {text}
    </button>
  );
}
