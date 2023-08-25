import { BigNumber } from "ethers";

export type GoodType = {
  goodId: BigNumber;
  name: string;
  category: string;
  pending?: boolean;
};

export type ModalValuesType = {
  isVisible: boolean;
  title: string;
  label: string;
  placeholder: string;
  state: "initial" | "error" | "confirmed" | "disabled" | undefined;
  onOk: (inputValue: string) => void;
  onClose: () => void;
};

export const defaultModalValues: ModalValuesType = {
  isVisible: false,
  title: "",
  label: "",
  placeholder: "",
  state: "initial",
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
