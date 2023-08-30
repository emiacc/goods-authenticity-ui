export default function Error({
  title,
  message
}: {
  title: string;
  message?: string | JSX.Element;
}) {
  return (
    <div className="py-20 text-center">
      <h1 className="py-5 font-blog text-3xl">{title}</h1>
      <p className="font-blog text-sm">{message}</p>
    </div>
  );
}
