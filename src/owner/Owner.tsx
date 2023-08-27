import { useEffect, useState, useCallback } from "react";
import { BigNumber } from "ethers";
import { Button } from "web3uikit";
import {
  ContractConfiguration,
  GoodType,
  RegisterModalValuesType,
  TransferModalValuesType,
  defaultRegisterModalValues,
  defaultTransferModalValues
} from "../common/types";
import useContractFunctions from "../contract/useContractFunctions";
import useContractPublicFunctions from "../contract/useContractPublicFunctions";
import useContractEvents from "../contract/useContractEvents";
import Good from "./Good";
import TransferModal from "./TransferModal";
import RegisterModal from "./RegisterModal";

type OwnerProps = {
  account: string;
  contractConfigs: ContractConfiguration[""];
};

export default function Owner({ account, contractConfigs }: OwnerProps) {
  const [goodsByOwner, setGoodsByOwner] = useState<GoodType[]>([]);
  const [transferModalValues, setTransferModalValues] =
    useState<TransferModalValuesType>(defaultTransferModalValues);
  const [registerModalValues, setRegisterModalValues] =
    useState<RegisterModalValuesType>(defaultRegisterModalValues);
  const { contractAddress, blockConfirmations, wsProvider } = contractConfigs;

  const { getGoodName, getGoodCategory, getGoodsByOwner } =
    useContractPublicFunctions({ contractAddress, wsProvider });
  const { mintGood } = useContractFunctions(contractAddress);

  const updateUI = useCallback(async () => {
    const goodsIdsByOwner = await getGoodsByOwner(account);
    const getGoodsData = goodsIdsByOwner.map(async (goodId) => {
      const name = await getGoodName(goodId);
      const category = await getGoodCategory(goodId);
      return { goodId, name, category } as GoodType;
    });
    const formatedGoodsData = await Promise.all(getGoodsData);
    setGoodsByOwner(formatedGoodsData);
  }, [account, getGoodCategory, getGoodName, getGoodsByOwner]);

  useEffect(() => {
    updateUI();
  }, [updateUI]);

  const onGoodChange = (
    goodId: BigNumber,
    owner: string,
    name: string,
    category: string
  ) => {
    if (owner.toUpperCase() === account.toUpperCase()) {
      setGoodsByOwner((goods) => [
        ...goods,
        { goodId, name, category, pending: true }
      ]);
    }
  };

  const onGoodTransfer = (from: string, goodId: BigNumber) => {
    if (from.toUpperCase() === account.toUpperCase()) {
      setGoodsByOwner((goods) =>
        goods.map((g) => {
          if (g.goodId.eq(goodId)) {
            return { ...g, pending: true };
          }
          return g;
        })
      );
    }
  };

  useContractEvents({
    contractAddress,
    wsProvider,
    blockConfirmations,
    onGoodChange,
    onGoodTransfer,
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
              setTransferModalValues={setTransferModalValues}
            />
          ))}
        </div>
      </div>
      <div className="fixed right-16 bottom-5">
        <Button
          color="red"
          icon="plus"
          iconLayout="trailing"
          size="large"
          text="Register"
          theme="primary"
          type="submit"
          onClick={() => {
            setRegisterModalValues({
              isVisible: true,
              onClose: () => {
                setRegisterModalValues(defaultRegisterModalValues);
              },
              onOk: (
                name: string,
                category: string,
                setNameInputState,
                setCategoryInputState
              ) => {
                if (name.length < 3 || name.length > 50) {
                  setNameInputState("error");
                  document.getElementById("nameInputModal")?.focus();
                } else if (category.length < 3 || category.length > 50) {
                  setCategoryInputState("error");
                  document.getElementById("categoryInputModal")?.focus();
                } else {
                  mintGood({
                    params: { params: { name, category } }
                  });
                  setRegisterModalValues(defaultRegisterModalValues);
                }
              }
            });
          }}
        />
      </div>
      <TransferModal {...transferModalValues} />
      <RegisterModal {...registerModalValues} />
    </>
  );
}
