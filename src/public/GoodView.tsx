import { useEffect, useMemo, useState } from "react";
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

type GoodViewProps = {
  goodId: string;
  contractConfigs: ContractConfiguration[""];
};

type GoodViewInfo = {
  name: string;
  category: string;
  pending: boolean;
  history: string[];
};

export default function GoodView({ goodId, contractConfigs }: GoodViewProps) {
  const goodIdBigNumber = useMemo(() => BigNumber.from(goodId), [goodId]);
  const [hasError, setHasError] = useState(false);
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
        setGoodInfo({ name, category, history, pending: false });
      } catch (e) {
        setHasError(true);
      }
    };

    history.replaceState({}, document.title, location.pathname);
    getGoodInfo();
  }, [getGoodName, getGoodCategory, getGoodOwnerHistory, goodIdBigNumber]);

  const onGoodTransfer = (_: string, goodId: BigNumber) => {
    if (goodId.eq(goodIdBigNumber)) {
      setGoodInfo((goodInfo) => {
        if (goodInfo) {
          return { ...goodInfo, pending: true };
        }
      });
    }
  };

  const updateUI = async () => {
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
  };

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
      list: history,
      onOk: () => setHistoryModalValues(defaultHistoryModalValues),
      onClose: () => setHistoryModalValues(defaultHistoryModalValues)
    });

  if (hasError) return <div>Error</div>;

  return goodInfo ? (
    <>
      <div className="my-3 mx-auto px-1 w-1/2 md:w-1/3 lg:my-4 lg:px-4 lg:w-1/4">
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
