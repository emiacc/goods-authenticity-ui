import { useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button, Loading } from "web3uikit";
import useOutsideClick from "../common/useOutsideClick";
import { QrValuesType, defaultQrValues } from "../common/types";

export default function GoodQr({
  src,
  isVisible,
  setQrValues
}: {
  src: string;
  isVisible: boolean;
  setQrValues: React.Dispatch<React.SetStateAction<QrValuesType>>;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, target, () => setQrValues(defaultQrValues));

  return (
    <div
      ref={ref}
      className={`${
        isVisible ? "flex" : "hidden"
      } fixed top-0 left-0 w-screen h-screen bg-black/80 justify-center items-center z-10`}
    >
      <span
        id="closeGoodQr"
        className="fixed top-6 right-8 text-white text-5xl font-bold cursor-pointer"
        onClick={() => setQrValues(defaultQrValues)}
      >
        &times;
      </span>
      <div
        ref={target}
        className="flex flex-col space-y-10 -mt-4 items-center h-fit p-16 bg-white rounded-2xl"
      >
        {src ? (
          <>
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
          </>
        ) : (
          <Loading spinnerColor="gray" />
        )}
      </div>
    </div>
  );
}
