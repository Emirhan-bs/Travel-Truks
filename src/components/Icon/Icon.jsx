import spriteUrl from "@/assets/icons/symbol-defs.svg?url";

export default function Icon({
  name,
  size = 20,
  width,
  height,

  variant = "fill", 

  color = "currentColor",

  strokeWidth = 2,

  style,
  className,
}) {
  const isStroke = variant === "stroke";

  return (
    <svg
      width={width ?? size}
      height={height ?? size}
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        color,
        ...style,
      }}
      aria-hidden="true"
      fill={isStroke ? "none" : "currentColor"}
      stroke={isStroke ? "currentColor" : "none"}
      strokeWidth={isStroke ? strokeWidth : undefined}
    >
      <use href={`${spriteUrl}#icon-${name}`} />
    </svg>
  );
}
