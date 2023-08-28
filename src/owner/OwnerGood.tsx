import { BigNumber, utils } from "ethers";
import { InputProps } from "web3uikit";
import useContractFunctions from "../contract/useContractFunctions";
import {
  GoodType,
  HistoryModalValuesType,
  TransferModalValuesType,
  defaultHistoryModalValues,
  defaultTransferModalValues
} from "../common/types";
import { useState } from "react";
import Good from "../common/Good";

type OwnerGoodProps = {
  contractAddress: string;
  good: GoodType;
  owner: string;
  getGoodOwnerHistory: (goodId: BigNumber) => Promise<string[]>;
  setTransferModalValues: React.Dispatch<
    React.SetStateAction<TransferModalValuesType>
  >;
  setHistoryModalValues: React.Dispatch<
    React.SetStateAction<HistoryModalValuesType>
  >;
};

export default function OwnerGood({
  contractAddress,
  good,
  owner,
  getGoodOwnerHistory,
  setTransferModalValues,
  setHistoryModalValues
}: OwnerGoodProps) {
  const { goodId, name, category, pending } = good;
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const { safeTransferFrom } = useContractFunctions(contractAddress);

  const handleTransfer = (
    to: string,
    setAddressInputState: React.Dispatch<
      React.SetStateAction<InputProps["state"]>
    >
  ) => {
    if (utils.isAddress(to) && owner.toUpperCase() !== to.toUpperCase()) {
      safeTransferFrom({
        params: {
          params: {
            from: owner,
            to: to,
            tokenId: goodId
          }
        }
      });
      setTransferModalValues(defaultTransferModalValues);
    } else {
      setAddressInputState("error");
      document.getElementById("transferInputModal")?.focus();
    }
  };

  const handleTransferClick = () => {
    setTransferModalValues({
      isVisible: true,
      onOk: handleTransfer,
      onClose: () => setTransferModalValues(defaultTransferModalValues)
    });
  };

  const handleHistoryClick = async () => {
    setIsLoadingHistory(true);
    getGoodOwnerHistory(goodId)
      .then((list) =>
        setHistoryModalValues({
          isVisible: true,
          list,
          onOk: () => setHistoryModalValues(defaultHistoryModalValues),
          onClose: () => setHistoryModalValues(defaultHistoryModalValues)
        })
      )
      .finally(() => setIsLoadingHistory(false));
  };

  return (
    <div className="my-1 px-1 w-1/2 md:w-1/3 lg:my-4 lg:px-4 lg:w-1/4">
      <Good
        {...{
          goodId,
          name,
          category,
          owner,
          pending,
          isLoadingHistory,
          handleHistoryClick,
          handleTransferClick
        }}
      />
    </div>
  );
}
