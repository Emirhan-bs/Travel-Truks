import spriteUrl from "@/assets/icons/symbol-defs.svg?url";

export default function Icon({
  name,
  size = 20,
  width,
  height,
  variant = "auto",   
  color,
  strokeWidth = 2,
  style,
  className,
  fill,
  stroke,
}) {
  const id = `#icon-${name}`;

  const finalFill =
    fill ?? (variant === "stroke" ? "none" : variant === "fill" ? "currentColor" : "currentColor");

  const finalStroke =
    stroke ?? (variant === "fill" ? "none" : "currentColor");

  return (
    <svg
      width={width ?? size}
      height={height ?? size}
      className={className}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        ...(color ? { color } : null),
        ...style,
      }}
      aria-hidden="true"
      fill={finalFill}
      stroke={finalStroke}
      strokeWidth={finalStroke !== "none" ? strokeWidth : undefined}
    >
      <use href={`${spriteUrl}${id}`} xlinkHref={`${spriteUrl}${id}`} />
    </svg>
  );
}
