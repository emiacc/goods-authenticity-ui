import { useEffect, useState } from "react";
import { BigNumber, ethers } from "ethers";
import { abi } from "./constants";

type GoodsByOwner = {
  goodId: BigNumber;
  name: string;
  category: string;
};

type UseContractEventsProps = {
  contractAddress: string;
  wsProvider: string;
  blockConfirmations: number;
  account: string;
  setGoodsByOwner: React.Dispatch<React.SetStateAction<GoodsByOwner[]>>;
  updateUI: () => Promise<void>;
};

export default function useContractEvents({
  contractAddress,
  wsProvider,
  blockConfirmations,
  account,
  setGoodsByOwner,
  updateUI
}: UseContractEventsProps) {
  const [latestBlockNumber, setLatestBlockNumber] = useState<number>(0);
  const [confirmationsCount, setConfirmationsCount] = useState<number>(0);

  useEffect(() => {
    const webSocketProvider = new ethers.providers.WebSocketProvider(
      wsProvider
    );

    const contract = new ethers.Contract(
      contractAddress,
      abi,
      webSocketProvider
    );

    webSocketProvider.on("block", (blockNumber) => {
      setLatestBlockNumber(blockNumber);
    });

    contract.on(
      "GoodChanged",
      (goodId: BigNumber, owner: string, name: string, category: string) => {
        if (owner.toUpperCase() === account.toUpperCase()) {
          setGoodsByOwner((goods) => [
            ...goods,
            { goodId, name: name + " pending", category }
          ]);
        }
      }
    );

    contract.on("Transfer", (from: string, _, goodId: BigNumber) => {
      if (from.toUpperCase() === account.toUpperCase()) {
        setGoodsByOwner((goods) =>
          goods.map((g) => {
            if (g.goodId.eq(goodId)) {
              return { ...g, name: g.name + " pending" };
            }
            return g;
          })
        );
      }
    });

    return () => {
      webSocketProvider.removeAllListeners();
      contract.removeAllListeners();
    };
  }, [account, contractAddress, setGoodsByOwner, wsProvider]);

  useEffect(() => {
    if (latestBlockNumber) {
      setConfirmationsCount((count) => count + 1);
    }
  }, [latestBlockNumber]);

  useEffect(() => {
    if (blockConfirmations && confirmationsCount >= blockConfirmations) {
      setConfirmationsCount(0);
      updateUI();
    }
  }, [blockConfirmations, confirmationsCount, updateUI]);
}
