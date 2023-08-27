import { useEffect, useState } from "react";
import { Modal as Web3Modal, Input, InputProps } from "web3uikit";
import { TransferModalValuesType } from "../common/types";

export default function TransferModal({
  isVisible,
  onOk,
  onClose
}: TransferModalValuesType) {
  const [addressInputValue, setAddressInputValue] = useState("");
  const [addressInputState, setAddressInputState] =
    useState<InputProps["state"]>("initial");

  useEffect(() => {
    if (!isVisible) {
      setAddressInputValue("");
      setAddressInputState("initial");
    }
  }, [isVisible]);

  return (
    <Web3Modal
      cancelText="Cancel"
      id="regular"
      okText="Transfer"
      title="Transfer"
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => onOk(addressInputValue, setAddressInputState)}
    >
      <div className="py-6 mb-4">
        <Input
          id="transferInputModal"
          label="Account"
          placeholder="0x0000000000000000000000000000000000000000"
          state={addressInputState}
          value={addressInputValue}
          onChange={(e) => {
            setAddressInputState("initial");
            setAddressInputValue(e.target.value);
          }}
          errorMessage="Invalid Address"
          width="100%"
        />
      </div>
    </Web3Modal>
  );
}
