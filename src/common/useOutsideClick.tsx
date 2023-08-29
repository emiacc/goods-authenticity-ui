import { useEffect } from "react";

export default function useOutsideClick(
  ref: React.RefObject<HTMLDivElement>,
  target: React.RefObject<HTMLDivElement>,
  callback: () => void
) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (target.current && !target.current.contains(e.target as Node)) {
        callback();
      }
    };

    if (ref.current) {
      const element = ref.current;
      element.addEventListener("click", handleClick);
      return () => {
        element.removeEventListener("click", handleClick);
      };
    }
  }, [callback, ref, target]);
}
