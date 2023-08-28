import { BigNumber, utils } from "ethers";
import { Blockie, InputProps, Loading } from "web3uikit";
import useContractFunctions from "../contract/useContractFunctions";
import { truncateStr } from "../common/utils";
import Button from "../common/Button";
import {
  GoodType,
  HistoryModalValuesType,
  TransferModalValuesType,
  defaultHistoryModalValues,
  defaultTransferModalValues
} from "../common/types";
import { useState } from "react";

type GoodProps = {
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

export default function Good({
  contractAddress,
  good,
  owner,
  getGoodOwnerHistory,
  setTransferModalValues,
  setHistoryModalValues
}: GoodProps) {
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
      <article
        className={`overflow-hidden rounded-lg shadow-lg ${
          pending ? "bg-gray-200" : ""
        }`}
      >
        <header className="flex flex-col space-y-2 items-center justify-between p-2 md:p-4">
          <div className="m-3">
            <Blockie size={15} seed={goodId.toString()} />
          </div>
          <p
            className="text-grey-darker text-lg w-11/12 text-center truncate"
            title={category}
          >
            {category}
          </p>
          <h1 className="text-2xl w-11/12 text-center truncate" title={name}>
            {name}
          </h1>
          <button className="text-grey-darker text-sm"></button>
          <Button text="Transfer" onClick={handleTransferClick} />
        </header>
        <footer className="flex flex-col p-6">
          {isLoadingHistory ? (
            <Loading spinnerColor="gray" />
          ) : (
            <div
              className="flex items-center no-underline hover:underline text-black cursor-pointer"
              onClick={handleHistoryClick}
            >
              <Blockie size={25} scale={1} seed={owner} />
              <p className="ml-2 text-base" title={owner}>
                {truncateStr(owner)}
              </p>
            </div>
          )}
        </footer>
      </article>
    </div>
  );
}
