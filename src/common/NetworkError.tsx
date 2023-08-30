import Error from "./Error";

export default function NetworkError() {
  return (
    <Error
      title="Network not supported"
      message="currently supported networks: Spolia"
    />
  );
}
