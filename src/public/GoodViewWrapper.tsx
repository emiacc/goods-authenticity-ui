import { contractConfiguration } from "../constants";
import { ContractConfiguration } from "../common/types";
import NetworkError from "../common/NetworkError";
import GoodView from "./GoodView";

export default function GoodViewWrapper({
  goodId,
  chainId,
  nonce
}: {
  goodId: string;
  chainId: string;
  nonce: string;
}) {
  const contractConfigs = (contractConfiguration as ContractConfiguration)[
    chainId
  ];

  if (!contractConfigs) {
    return <NetworkError />;
  }

  return <GoodView {...{ goodId, nonce, contractConfigs }} />;
}
