import { useCallback, useMemo } from "react";
import { BigNumber, ethers } from "ethers";
import { abi } from "../constants";

type UseContractPublicFunctionsProps = {
  contractAddress: string;
  wsProvider: string;
};

export default function useContractPublicFunctions({
  contractAddress,
  wsProvider
}: UseContractPublicFunctionsProps) {
  const provider = useMemo(
    () => new ethers.providers.WebSocketProvider(wsProvider),
    [wsProvider]
  );

  const contract = useMemo(
    () => new ethers.Contract(contractAddress, abi, provider),
    [contractAddress, provider]
  );

  const getGoodName = useCallback(
    (goodId: BigNumber): Promise<string> => contract.getGoodName(goodId),
    [contract]
  );

  const getGoodCategory = useCallback(
    (goodId: BigNumber): Promise<string> => contract.getGoodCategory(goodId),
    [contract]
  );

  const getGoodOwnerHistory = useCallback(
    (goodId: BigNumber): Promise<string[]> =>
      contract.getGoodOwnerHistory(goodId),
    [contract]
  );

  const getGoodsByOwner = useCallback(
    (owner: string): Promise<BigNumber[]> => contract.getGoodsByOwner(owner),
    [contract]
  );

  return { getGoodsByOwner, getGoodName, getGoodCategory, getGoodOwnerHistory };
}
