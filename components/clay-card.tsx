import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ClayCardProps = HTMLAttributes<HTMLDivElement> & {
  color?: "white" | "blue" | "blueLight" | "bluePale" | "ice" | "mint" | "lavender" | "sky" | "blush";
  pressed?: boolean;
};

const colorMap = {
  white: "bg-white",
  blue: "bg-clay-blue",
  blueLight: "bg-clay-blue-light",
  bluePale: "bg-clay-blue-pale",
  ice: "bg-clay-ice",
  mint: "bg-clay-mint",
  lavender: "bg-clay-lavender",
  sky: "bg-clay-sky",
  blush: "bg-clay-blush",
} as const;

export function ClayCard({
  className,
  color = "white",
  pressed = false,
  ...props
}: ClayCardProps) {
  return (
    <div
      className={cn(
        colorMap[color],
        pressed ? "clay-pressed" : "clay",
        className,
      )}
      {...props}
    />
  );
}
