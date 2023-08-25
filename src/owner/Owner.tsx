import { useEffect, useState, useCallback } from "react";
import { BigNumber } from "ethers";
import {
  ContractConfiguration,
  GoodType,
  ModalValuesType,
  defaultModalValues
} from "../common/types";
import { contractConfiguration } from "../constants";
import useContractFunctions from "../contract/useContractFunctions";
import useContractEvents from "../contract/useContractEvents";
import Good from "./Good";
import Modal from "../common/Modal";

type OwnerProps = {
  account: string;
  chainId: number;
};

export default function Owner({ account, chainId }: OwnerProps) {
  const [goodsByOwner, setGoodsByOwner] = useState<GoodType[]>([]);
  const [modalValues, setModalValues] =
    useState<ModalValuesType>(defaultModalValues);
  const contractConfig: ContractConfiguration = contractConfiguration;
  const { contractAddress, blockConfirmations, wsProvider } =
    contractConfig[chainId];

  const { mintGood, getGoodName, getGoodCategory, getGoodsByOwner } =
    useContractFunctions(contractAddress);

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
      return { goodId, name, category } as GoodType;
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
      <div className="container my-12 mx-auto px-4 md:px-12">
        <div className="flex flex-wrap -mx-1 lg:-mx-4">
          {goodsByOwner.map((g) => (
            <Good
              key={g.goodId.toString()}
              contractAddress={contractAddress}
              good={g}
              owner={account}
              setModalValues={setModalValues}
            />
          ))}
        </div>
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

      <Modal {...modalValues} />
    </>
  );
}
