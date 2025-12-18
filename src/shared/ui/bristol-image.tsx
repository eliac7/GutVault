import Image from "next/image";
import { cn } from "../lib/utils";

interface BristolImageProps {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  className?: string;
}

export function BristolImage({ type, className }: BristolImageProps) {
  return (
    <div
      className={cn(
        "relative flex items-center justify-center aspect-square",
        className
      )}
    >
      <Image
        src={`/bristol/stool_type_${type}.png`}
        alt={`Bristol Stool Type ${type}`}
        fill
        className="object-contain aspect-square"
      />
    </div>
  );
}
