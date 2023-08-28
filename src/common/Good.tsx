import { BigNumber } from "ethers";
import { Blockie, Loading } from "web3uikit";
import { truncateStr } from "../common/utils";
import Button from "../common/Button";

type GoodProps = {
  goodId: BigNumber;
  pending?: boolean;
  name: string;
  category: string;
  owner: string;
  isLoadingHistory?: boolean;
  handleTransferClick?: () => void;
  handleHistoryClick: () => void;
};

export default function Good({
  goodId,
  pending,
  name,
  category,
  owner,
  isLoadingHistory,
  handleTransferClick,
  handleHistoryClick
}: GoodProps) {
  return (
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
        <h1 className="text-2xl w-11/12 text-center truncate pb-3" title={name}>
          {name}
        </h1>
        {handleTransferClick ? (
          <Button text="Transfer" onClick={handleTransferClick} />
        ) : null}
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
  );
}
