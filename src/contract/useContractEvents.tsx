import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { abi } from "../constants";

type UseContractEventsProps = {
  contractAddress: string;
  wsProvider: string;
  blockConfirmations: number;
  onGoodChange?: (
    goodId: BigNumber,
    owner: string,
    name: string,
    category: string
  ) => void;
  onGoodTransfer?: (from: string, goodId: BigNumber) => void;
  updateUI?: () => Promise<void>;
};

export default function useContractEvents({
  contractAddress,
  wsProvider,
  blockConfirmations,
  onGoodChange,
  onGoodTransfer,
  updateUI
}: UseContractEventsProps) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0);
  const [confirmationsCount, setConfirmationsCount] = useState<number>(0);

  useEffect(() => {
    const provider = new ethers.providers.WebSocketProvider(wsProvider);
    const contract = new ethers.Contract(contractAddress, abi, provider);

    provider.on("block", (blockNumber) => {
      setLatestBlockNumber(blockNumber);
    });

    if (onGoodChange) {
      contract.on(
        "GoodChanged",
        (goodId: BigNumber, owner: string, name: string, category: string) => {
          onGoodChange(goodId, owner, name, category);
        }
      );
    }

    if (onGoodTransfer) {
      contract.on("Transfer", (from: string, _, goodId: BigNumber) => {
        onGoodTransfer(from, goodId);
      });
    }

    return () => {
      provider.removeAllListeners();
      contract.removeAllListeners();
    };
  }, [contractAddress, onGoodChange, onGoodTransfer, wsProvider]);

  useEffect(() => {
    if (latestBlockNumber) {
      setConfirmationsCount((count) => count + 1);
    }
  }, [latestBlockNumber]);

  useEffect(() => {
    if (blockConfirmations && confirmationsCount >= blockConfirmations) {
      setConfirmationsCount(0);
      updateUI && updateUI();
    }
  }, [blockConfirmations, confirmationsCount, updateUI]);
}
