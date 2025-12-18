import React from "react";
import Image from "next/image";

interface BristolImageProps {
  type: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  className?: string;
  size?: number;
}

export function BristolImage({
  type,
  className,
  size = 40,
}: BristolImageProps) {
  return (
    <div
      className={`relative flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src={`/bristol/stool_type_${type}.png`}
        alt={`Bristol Stool Type ${type}`}
        fill
        className="object-contain"
        sizes={`${size}px`}
      />
    </div>
  );
}
