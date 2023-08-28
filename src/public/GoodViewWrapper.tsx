import { contractConfiguration } from "../constants";
import { ContractConfiguration } from "../common/types";
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
    return <div>Network not supported</div>;
  }

  return <GoodView {...{ goodId, contractConfigs }} />;
}
