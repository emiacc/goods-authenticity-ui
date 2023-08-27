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
import { contractConfiguration } from "../constants";
import useContractFunctions from "../contract/useContractFunctions";
import useContractEvents from "../contract/useContractEvents";
import Good from "./Good";
import TransferModal from "./TransferModal";
import RegisterModal from "./RegisterModal";

type OwnerProps = {
  account: string;
  chainId: number;
};

export default function Owner({ account, chainId }: OwnerProps) {
  const [goodsByOwner, setGoodsByOwner] = useState<GoodType[]>([]);
  const [transferModalValues, setTransferModalValues] =
    useState<TransferModalValuesType>(defaultTransferModalValues);
  const [registerModalValues, setRegisterModalValues] =
    useState<RegisterModalValuesType>(defaultRegisterModalValues);
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
