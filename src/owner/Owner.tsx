import { useEffect, useState, useCallback } from "react";
import { BigNumber } from "ethers";
import { Button, Loading } from "web3uikit";
import {
  ContractConfiguration,
  GoodType,
  RegisterModalValuesType,
  TransferModalValuesType,
  HistoryModalValuesType,
  QrValuesType,
  defaultRegisterModalValues,
  defaultTransferModalValues,
  defaultHistoryModalValues,
  defaultQrValues
} from "../common/types";
import useContractFunctions from "../contract/useContractFunctions";
import useContractPublicFunctions from "../contract/useContractPublicFunctions";
import useContractEvents from "../contract/useContractEvents";
import OwnerGood from "./OwnerGood";
import TransferModal from "./TransferModal";
import RegisterModal from "./RegisterModal";
import HistoryModal from "../common/HistoryModal";
import GoodQr from "./GoodQr";
import { bigNumberListIncludes, compareAddresses } from "../common/utils";

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
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [qrValues, setQrValues] = useState<QrValuesType>(defaultQrValues);
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
    setIsFetching(false);
  }, [account, getGoodCategory, getGoodName, getGoodsByOwner]);

  useEffect(() => {
    const goodsIdsByOwner = goodsByOwner.map((good) => good.goodId);
    if (goodsIdsByOwner.length) {
      if (
        qrValues.qrGoodId &&
        !bigNumberListIncludes(goodsIdsByOwner, qrValues.qrGoodId)
      ) {
        setQrValues(defaultQrValues);
      } else if (
        transferModalValues.goodId &&
        !bigNumberListIncludes(goodsIdsByOwner, transferModalValues.goodId)
      ) {
        setTransferModalValues(defaultTransferModalValues);
      } else if (
        historyModalValues.goodId &&
        !bigNumberListIncludes(goodsIdsByOwner, historyModalValues.goodId)
      ) {
        setHistoryModalValues(defaultHistoryModalValues);
      }
    }
  }, [
    goodsByOwner,
    historyModalValues.goodId,
    qrValues.qrGoodId,
    transferModalValues.goodId
  ]);

  useEffect(() => {
    setIsFetching(true);
    updateUI().finally(() => setIsFetching(false));
  }, [updateUI]);

  const onGoodChange = useCallback(
    (goodId: BigNumber, owner: string, name: string, category: string) => {
      if (compareAddresses(owner, account)) {
        setGoodsByOwner((goods) => [
          ...goods,
          { goodId, name, category, pending: true }
        ]);
      }
    },
    [account]
  );

  const onGoodTransfer = useCallback(
    (from: string, goodId: BigNumber) => {
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
    },
    [account]
  );

  const handleAvatarClick = async (goodId: BigNumber) => {
    setQrValues({ qrGoodId: goodId, qrIsVisible: true, qrParams: null });
    const history = await getGoodOwnerHistory(goodId);
    const urlParams = new URLSearchParams({
      goodId: goodId.toString(),
      chainId: chainId.toString(),
      nonce: history.length.toString()
    });
    setQrValues((qrValues) => ({ ...qrValues, qrParams: urlParams }));
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
      {isFetching ? (
        <div className="flex justify-center pt-12">
          <Loading size={50} spinnerColor="gray" />
        </div>
      ) : (
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
      )}
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
                    onSuccess: (res) => console.log(res),
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
        isVisible={qrValues.qrIsVisible}
        setQrValues={setQrValues}
        src={qrValues.qrParams ? location.origin + "?" + qrValues.qrParams : ""}
      />
    </>
  );
}
