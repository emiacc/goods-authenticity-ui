import { utils } from "ethers";
import { Blockie } from "web3uikit";
import useContractFunctions from "../contract/useContractFunctions";
import { truncateStr } from "../common/utils";
import Button from "../common/Button";
import { GoodType, ModalValuesType, defaultModalValues } from "../common/types";

type GoodProps = {
  contractAddress: string;
  good: GoodType;
  owner: string;
  setModalValues: React.Dispatch<React.SetStateAction<ModalValuesType>>;
};

export default function Good({
  contractAddress,
  good,
  owner,
  setModalValues
}: GoodProps) {
  const { goodId, name, category, pending } = good;
  const { safeTransferFrom } = useContractFunctions(contractAddress);
  const handleTransfer = (to: string) => {
    if (utils.isAddress(to) && owner.toUpperCase() !== to.toUpperCase()) {
      setModalValues(defaultModalValues);
      safeTransferFrom({
        params: {
          params: {
            from: owner,
            to: to,
            tokenId: goodId
          }
        }
      });
    } else {
      setModalValues((modalValues) => ({ ...modalValues, state: "error" }));
    }
  };

  const handleClick = () => {
    setModalValues({
      isVisible: true,
      title: "Transfer",
      label: "Account",
      placeholder: "0x0000000000000000000000000000000000000000",
      state: "initial",
      onOk: handleTransfer,
      onClose: () => setModalValues(defaultModalValues)
    });
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
          <p className="text-grey-darker text-lg">{category}</p>
          <h1 className="text-2xl">{name}</h1>
          <button className="text-grey-darker text-sm"></button>
          <Button text="Transfer" onClick={handleClick} />
        </header>
        <footer className="flex flex-col p-6">
          <div className="flex items-center no-underline hover:underline text-black">
            <Blockie size={25} scale={1} seed={owner} />
            <p className="ml-2 text-sm">{truncateStr(owner)}</p>
          </div>
        </footer>
      </article>
    </div>
  );
}
