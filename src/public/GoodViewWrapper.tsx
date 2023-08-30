import { contractConfiguration } from "../constants";
import { ContractConfiguration } from "../common/types";
import NetworkError from "../common/NetworkError";
import GoodView from "./GoodView";

export default function GoodViewWrapper({
  goodId,
  chainId
}: {
  goodId: string;
  chainId: string;
}) {
  const contractConfigs = (contractConfiguration as ContractConfiguration)[
    chainId
  ];

  if (!contractConfigs) {
    return <NetworkError />;
  }

  return <GoodView {...{ goodId, contractConfigs }} />;
}
