import { ConnectButton } from "web3uikit";

export default function Header() {
  return (
    <div className="p-5 border-b-2 flex flex-row justify-between items-center">
      <h1 className="font-blog text-xl">Goods Authenticity</h1>
      <ConnectButton moralisAuth={false} />
    </div>
  );
}
