import { useEffect, useState, useCallback } from "react";
import { BigNumber } from "ethers";
import { Button } from "web3uikit";
import {
  ContractConfiguration,
  GoodType,
  RegisterModalValuesType,
  TransferModalValuesType,
  HistoryModalValuesType,
  defaultRegisterModalValues,
  defaultTransferModalValues,
  defaultHistoryModalValues
} from "../common/types";
import useContractFunctions from "../contract/useContractFunctions";
import useContractPublicFunctions from "../contract/useContractPublicFunctions";
import useContractEvents from "../contract/useContractEvents";
import OwnerGood from "./OwnerGood";
import TransferModal from "./TransferModal";
import RegisterModal from "./RegisterModal";
import HistoryModal from "../common/HistoryModal";
import GoodQr from "./GoodQr";
import { compareAddresses } from "../common/utils";

type OwnerProps = {
  account: string;
  chainId: number;
  contractConfigs: ContractConfiguration[""];
};

export default function Owner({
  account,
  chainId,
  contractConfigs
}: OwnerProps) {
  const [goodsByOwner, setGoodsByOwner] = useState<GoodType[]>([]);
  const [params, setParams] = useState<URLSearchParams>();
  const [isQrVisible, setIsQrVisible] = useState(false);
  const [transferModalValues, setTransferModalValues] =
    useState<TransferModalValuesType>(defaultTransferModalValues);
  const [registerModalValues, setRegisterModalValues] =
    useState<RegisterModalValuesType>(defaultRegisterModalValues);
  const [historyModalValues, setHistoryModalValues] =
    useState<HistoryModalValuesType>(defaultHistoryModalValues);
  const { contractAddress, blockConfirmations, wsProvider } = contractConfigs;

  const { getGoodName, getGoodCategory, getGoodsByOwner, getGoodOwnerHistory } =
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
    if (compareAddresses(owner, account)) {
      setGoodsByOwner((goods) => [
        ...goods,
        { goodId, name, category, pending: true }
      ]);
    }
  };

  const onGoodTransfer = (from: string, goodId: BigNumber) => {
    if (compareAddresses(from, account)) {
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

  const handleAvatarClick = (goodId: string) => {
    const urlParams = new URLSearchParams({
      goodId,
      chainId: chainId.toString()
    });
    setParams(urlParams);
    setIsQrVisible(true);
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
            <OwnerGood
              key={g.goodId.toString()}
              contractAddress={contractAddress}
              good={g}
              owner={account}
              handleAvatarClick={handleAvatarClick}
              getGoodOwnerHistory={getGoodOwnerHistory}
              setTransferModalValues={setTransferModalValues}
              setHistoryModalValues={setHistoryModalValues}
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
      <HistoryModal {...historyModalValues} />
      <GoodQr
        isVisible={isQrVisible}
        setIsVisible={setIsQrVisible}
        src={location.origin + "?" + params}
      />
    </>
  );
}
