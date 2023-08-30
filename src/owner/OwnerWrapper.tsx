import { useMoralis } from "react-moralis";
import { contractConfiguration } from "../constants";
import { ContractConfiguration } from "../common/types";
import Owner from "./Owner";
import Error from "../common/Error";
import NetworkError from "../common/NetworkError";

export default function OwnerWrapper() {
  const { chainId: chainIdHex, isWeb3Enabled, account } = useMoralis();
  const chainId = parseInt(chainIdHex!);
  const contractConfigs = (contractConfiguration as ContractConfiguration)[
    chainId
  ];

  if (chainId && !contractConfigs) {
    return <NetworkError />;
  }

  if (!isWeb3Enabled) {
    return <Error title="Connect to a Wallet" />;
  }

  if (isWeb3Enabled && account && contractConfigs) {
    const props = {
      account: account.toLowerCase(),
      contractConfigs,
      chainId
    };
    return <Owner {...props} />;
  }
}
