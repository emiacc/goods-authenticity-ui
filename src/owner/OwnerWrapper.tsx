import { useMoralis } from "react-moralis";
import Owner from "./Owner";
import GoodView from "../public/GoodView";

export default function OwnerWrapper() {
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex!);

  if (isWeb3Enabled && account && chainId) {
    const props = { account, chainId };
    return <Owner {...props} />;
  }
  return <GoodView />;
}
