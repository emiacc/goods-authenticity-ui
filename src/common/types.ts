import { BigNumber } from "ethers";
import { InputProps } from "web3uikit";

export type GoodType = {
  goodId: BigNumber;
  name: string;
  category: string;
  pending?: boolean;
};

export type TransferModalValuesType = {
  isVisible: boolean;
  onOk: (
    inputValue: string,
    setInputState: React.Dispatch<React.SetStateAction<InputProps["state"]>>
  ) => void;
  onClose: () => void;
};

export const defaultTransferModalValues: TransferModalValuesType = {
  isVisible: false,
  onOk: () => {},
  onClose: () => {}
};

export type RegisterModalValuesType = {
  isVisible: boolean;
  onOk: (
    nameInputValue: string,
    categoryInputValue: string,
    setNameState: React.Dispatch<React.SetStateAction<InputProps["state"]>>,
    setCategoryState: React.Dispatch<React.SetStateAction<InputProps["state"]>>
  ) => void;
  onClose: () => void;
};

export const defaultRegisterModalValues: RegisterModalValuesType = {
  isVisible: false,
  onOk: () => {},
  onClose: () => {}
};

export type HistoryModalValuesType = {
  isVisible: boolean;
  list: string[];
  onOk: () => void;
  onClose: () => void;
};

export const defaultHistoryModalValues: HistoryModalValuesType = {
  isVisible: false,
  list: [],
  onOk: () => {},
  onClose: () => {}
};

export type ContractConfiguration = {
  [key: string]: {
    contractAddress: string;
    blockConfirmations: number;
    wsProvider: string;
  };
};
