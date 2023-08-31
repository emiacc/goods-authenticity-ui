import { useCallback, useEffect, useMemo, useState } from "react";
import { BigNumber } from "ethers";
import {
  ContractConfiguration,
  HistoryModalValuesType,
  defaultHistoryModalValues
} from "../common/types";
import Good from "../common/Good";
import HistoryModal from "../common/HistoryModal";
import useContractEvents from "../contract/useContractEvents";
import useContractPublicFunctions from "../contract/useContractPublicFunctions";
import Error from "../common/Error";
import { Loading } from "web3uikit";

type GoodViewProps = {
  goodId: string;
  nonce: string;
  contractConfigs: ContractConfiguration[""];
};

type GoodViewInfo = {
  name: string;
  category: string;
  pending: boolean;
  history: string[];
};

export default function GoodView({
  goodId,
  nonce,
  contractConfigs
}: GoodViewProps) {
  const goodIdBigNumber = useMemo(() => BigNumber.from(goodId), [goodId]);
  const [hasError, setHasError] = useState(false);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [goodInfo, setGoodInfo] = useState<GoodViewInfo>();
  const [historyModalValues, setHistoryModalValues] =
    useState<HistoryModalValuesType>(defaultHistoryModalValues);
  const { contractAddress, wsProvider, blockConfirmations } = contractConfigs;

  const { getGoodName, getGoodCategory, getGoodOwnerHistory } =
    useContractPublicFunctions({
      contractAddress,
      wsProvider
    });

  useEffect(() => {
    const getGoodInfo = async () => {
      try {
        const name = await getGoodName(goodIdBigNumber);
        const category = await getGoodCategory(goodIdBigNumber);
        const history = await getGoodOwnerHistory(goodIdBigNumber);
        if (parseInt(nonce) === history.length) {
          setGoodInfo({ name, category, history, pending: false });
        } else {
          setHasError(true);
        }
      } catch (e) {
        setHasError(true);
      }
    };

    history.replaceState({}, document.title, location.pathname);
    setIsFetching(true);
    getGoodInfo().finally(() => setIsFetching(false));
  }, [
    getGoodName,
    getGoodCategory,
    getGoodOwnerHistory,
    goodIdBigNumber,
    nonce
  ]);

  const onGoodTransfer = useCallback(
    (_: string, goodId: BigNumber) => {
      if (goodId.eq(goodIdBigNumber)) {
        setGoodInfo((goodInfo) => {
          if (goodInfo) {
            return { ...goodInfo, pending: true };
          }
        });
      }
    },
    [goodIdBigNumber]
  );

  const updateUI = useCallback(async () => {
    if (goodInfo?.pending) {
      try {
        const history = await getGoodOwnerHistory(goodIdBigNumber);
        setGoodInfo((goodInfo) => {
          if (goodInfo) {
            return { ...goodInfo, history, pending: false };
          }
        });
        setHistoryModalValues((historyModalValues) => ({
          ...historyModalValues,
          list: history
        }));
      } catch (e) {
        setHasError(true);
      }
    }
  }, [getGoodOwnerHistory, goodIdBigNumber, goodInfo?.pending]);

  useContractEvents({
    contractAddress,
    wsProvider,
    blockConfirmations,
    onGoodTransfer,
    updateUI
  });

  const handleHistoryClick = (history: string[]) =>
    setHistoryModalValues({
      isVisible: true,
      goodId: goodIdBigNumber,
      list: history,
      onOk: () => setHistoryModalValues(defaultHistoryModalValues),
      onClose: () => setHistoryModalValues(defaultHistoryModalValues)
    });

  if (hasError) {
    return (
      <Error
        title="Item not found"
        message={
          <a className="underline" href="/">
            Reload
          </a>
        }
      />
    );
  }

  if (isFetching) {
    return (
      <div className="flex justify-center pt-12">
        <Loading size={50} spinnerColor="gray" />
      </div>
    );
  }

  return goodInfo ? (
    <>
      <div className="my-3 mx-auto px-1 w-full md:w-1/3 lg:my-4 lg:px-4 lg:w-1/4">
        <Good
          goodId={goodIdBigNumber}
          name={goodInfo.name}
          category={goodInfo.category}
          pending={goodInfo.pending}
          owner={goodInfo.history[goodInfo.history.length - 1]}
          handleHistoryClick={() => handleHistoryClick(goodInfo.history)}
        />
      </div>
      <HistoryModal {...historyModalValues} />
    </>
  ) : null;
}
