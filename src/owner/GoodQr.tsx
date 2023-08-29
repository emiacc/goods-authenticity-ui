import { QRCodeSVG } from "qrcode.react";
import { Button } from "web3uikit";

export default function OwnerGood({
  src,
  isVisible,
  setIsVisible
}: {
  src: string;
  isVisible: boolean;
  setIsVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <div
      className={`${
        isVisible ? "flex" : "hidden"
      } fixed top-0 left-0 w-screen h-screen bg-black/80 justify-center items-center`}
    >
      <span
        id="closeGoodQr"
        className="fixed top-6 right-8 text-white text-5xl font-bold cursor-pointer"
        onClick={() => setIsVisible(false)}
      >
        &times;
      </span>
      <div className="flex flex-col space-y-10 items-center h-fit p-16 bg-white rounded-2xl">
        <QRCodeSVG
          height={240}
          width={240}
          className="max-w-[800px] max-h-[600px] object-cover"
          value={src}
        />
        <Button
          id="downloadGoodQr"
          color="blue"
          icon="download"
          iconLayout="icon-only"
          onClick={print}
          radius={0}
          size="regular"
          theme="outline"
          type="button"
        />
      </div>
    </div>
  );
}
