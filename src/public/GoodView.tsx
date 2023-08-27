import { useEffect } from "react";
import { BigNumber } from "ethers";
import useContractPublicFunctions from "../contract/useContractPublicFunctions";

export default function GoodView() {
  const { getGoodName, getGoodCategory, getGoodOwnerHistory } =
    useContractPublicFunctions({
      contractAddress: "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      wsProvider: "ws://localhost:8545"
    });

  useEffect(() => {
    getGoodName(BigNumber.from(74)).then(console.log);
    getGoodCategory(BigNumber.from(74)).then(console.log);
    getGoodOwnerHistory(BigNumber.from(74)).then(console.log);
  }, [getGoodName, getGoodCategory, getGoodOwnerHistory]);

  return <div>Public</div>;
}
