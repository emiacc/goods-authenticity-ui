import { useEffect, useState } from "react";
import { Modal, Input, InputProps } from "web3uikit";
import { RegisterModalValuesType } from "../common/types";

export default function RegisterModal({
  isVisible,
  onOk,
  onClose
}: RegisterModalValuesType) {
  const [nameInputValue, setNameInputValue] = useState("");
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [nameInputState, setNameInputState] =
    useState<InputProps["state"]>("initial");
  const [categoryInputState, setCategoryInputState] =
    useState<InputProps["state"]>("initial");

  useEffect(() => {
    if (!isVisible) {
      setNameInputValue("");
      setCategoryInputValue("");
      setNameInputState("initial");
      setCategoryInputState("initial");
    }
  }, [isVisible]);

  return (
    <Modal
      cancelText="Cancel"
      id="regular"
      okText="Register"
      title="Register"
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={() =>
        onOk(
          nameInputValue,
          categoryInputValue,
          setNameInputState,
          setCategoryInputState
        )
      }
    >
      <div className="py-6">
        <Input
          label="Name"
          id="nameInputModal"
          state={nameInputState}
          value={nameInputValue}
          onChange={(e) => {
            setNameInputState("initial");
            setNameInputValue(e.target.value);
          }}
          errorMessage="Required. Length should be between 3 and 50 characters"
          width="100%"
        />
      </div>
      <div className="py-6 mb-4">
        <Input
          label="Category"
          id="categoryInputModal"
          state={categoryInputState}
          value={categoryInputValue}
          onChange={(e) => {
            setCategoryInputState("initial");
            setCategoryInputValue(e.target.value);
          }}
          errorMessage="Required. Length should be between 3 and 50 characters"
          width="100%"
        />
      </div>
    </Modal>
  );
}
