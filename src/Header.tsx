import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1
        onClick={() => location.reload()}
        className="font-blog text-l cursor-pointer md:text-xl"
      >
        Goods Authenticity
      </h1>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
