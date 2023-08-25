import { useWeb3Contract } from "react-moralis";
import { abi } from "../constants";

export default function useContractFunctions(contractAddress?: string) {
  const { runContractFunction: mintGood } = useWeb3Contract({
    abi,
    contractAddress: contractAddress,
    functionName: "mintGood"
  });

  const { runContractFunction: safeTransferFrom } = useWeb3Contract({
    abi,
    contractAddress: contractAddress,
    functionName: "safeTransferFrom(address,address,uint256)"
  });

  const { runContractFunction: getGoodName } = useWeb3Contract({
    abi,
    contractAddress: contractAddress,
    functionName: "getGoodName"
  });

  const { runContractFunction: getGoodCategory } = useWeb3Contract({
    abi,
    contractAddress: contractAddress,
    functionName: "getGoodCategory"
  });

  const { runContractFunction: getGoodsByOwner } = useWeb3Contract({
    abi,
    contractAddress: contractAddress,
    functionName: "getGoodsByOwner"
  });

  return {
    mintGood,
    safeTransferFrom,
    getGoodName,
    getGoodCategory,
    getGoodsByOwner
  };
}
