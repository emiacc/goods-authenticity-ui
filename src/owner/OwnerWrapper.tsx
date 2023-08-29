import { useMoralis } from "react-moralis";
import { contractConfiguration } from "../constants";
import { ContractConfiguration } from "../common/types";
import Owner from "./Owner";

export default function OwnerWrapper() {
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex!);
  const contractConfigs = (contractConfiguration as ContractConfiguration)[
    chainId
  ];

  if (chainId && !contractConfigs) {
    return <div>Network not supported</div>;
  }

  if (!isWeb3Enabled) {
    return <div>Connect to a wallet</div>;
  }

  if (isWeb3Enabled && account && contractConfigs) {
    const props = { account, contractConfigs, chainId };
    return <Owner {...props} />;
  }
}
