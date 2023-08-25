import { useEffect, useState } from "react";
import { Modal as Web3Modal, Input } from "web3uikit";
import { ModalValuesType } from "./types";

export default function Modal({
  isVisible,
  title,
  label,
  placeholder,
  state,
  onOk,
  onClose
}: ModalValuesType) {
  const [inputValue, setInputValue] = useState("");
  useEffect(() => {
    if (!isVisible) {
      setInputValue("");
    }
  }, [isVisible]);

  return (
    <Web3Modal
      cancelText="Cancel"
      id="regular"
      isVisible={isVisible}
      okText={title}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() => onOk(inputValue)}
      title={title}
    >
      <div className="py-6">
        <Input
          placeholder={placeholder}
          state={state}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          label={label}
          errorMessage=""
          width="100%"
        />
      </div>
    </Web3Modal>
  );
}
