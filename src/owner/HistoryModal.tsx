import { Modal, CopyButton } from "web3uikit";
import { HistoryModalValuesType } from "../common/types";

export default function HistoryModal({
  isVisible,
  list,
  onOk,
  onClose
}: HistoryModalValuesType) {
  return (
    <Modal
      id="regular"
      okText="Close"
      title="History"
      hasCancel={false}
      isVisible={isVisible}
      onCancel={onClose}
      onCloseButtonPressed={onClose}
      onOk={onOk}
    >
      <div className="py-6 mb-4">
        {list.map((account, index) => (
          <div key={index} className="mb-3">
            <p className="font-mono text-sm text-center mb-1">
              {account}
              <CopyButton text={account} iconSize={18} />
            </p>
            {index < list.length - 1 ? <p className="text-center">↓</p> : null}
          </div>
        ))}
      </div>
    </Modal>
  );
}
