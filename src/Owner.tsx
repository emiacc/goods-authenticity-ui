import { useEffect, useState, useCallback } from "react";
import { BigNumber } from "ethers";
import { contractConfiguration } from "./constants";
import useContractFunctions from "./useContractFunctions";
import useContractEvents from "./useContractEvents";

type ContractConfiguration = {
  [key: string]: {
    contractAddress: string;
    blockConfirmations: number;
    wsProvider: string;
  };
};

type GoodsByOwner = {
  goodId: BigNumber;
  name: string;
  category: string;
};

export default function Owner({
  account,
  chainId
}: {
  account: string;
  chainId: number;
}) {
  const [goodsByOwner, setGoodsByOwner] = useState<GoodsByOwner[]>([]);
  const contractConfig: ContractConfiguration = contractConfiguration;
  const { contractAddress, blockConfirmations, wsProvider } =
    contractConfig[chainId];

  const {
    mintGood,
    safeTransferFrom,
    getGoodName,
    getGoodCategory,
    getGoodsByOwner
  } = useContractFunctions(contractAddress);

  const updateUI = useCallback(async () => {
    const goodsIdsByOwner = (await getGoodsByOwner({
      params: { params: { owner: account } }
    })) as BigNumber[];
    const getGoodsData = goodsIdsByOwner.map(async (goodId) => {
      const name = (await getGoodName({
        params: { params: { goodId } }
      })) as string;
      const category = (await getGoodCategory({
        params: { params: { goodId } }
      })) as string;
      return { goodId, name, category } as GoodsByOwner;
    });
    const formatedGoodsData = await Promise.all(getGoodsData);
    setGoodsByOwner(formatedGoodsData);
  }, [account, getGoodCategory, getGoodName, getGoodsByOwner]);

  useEffect(() => {
    updateUI();
  }, [updateUI]);

  useContractEvents({
    contractAddress,
    wsProvider,
    blockConfirmations,
    account,
    setGoodsByOwner,
    updateUI
  });

  return (
    <>
      <div>
        {goodsByOwner.map((g) => (
          <li key={g.goodId.toString()}>
            {g.category + ": " + g.name}
            <button
              onClick={() =>
                safeTransferFrom({
                  params: {
                    params: {
                      from: account,
                      to: "0xaDDF7142B0c6d9BbEd4aBF73468E1C8EC2efF1b7",
                      tokenId: g.goodId
                    }
                  }
                })
              }
            >
              Transfer
            </button>
          </li>
        ))}
      </div>
      <button
        onClick={() =>
          mintGood({
            params: { params: { name: "ccc", category: "Peugeot" } }
          })
        }
      >
        Mint
      </button>
    </>
  );
}
