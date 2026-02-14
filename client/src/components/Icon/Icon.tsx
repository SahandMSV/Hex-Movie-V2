import styles from "./Icon.module.css";

type IconName = "arrow-left" | "arrow-right";

export default function Icon({
  name,
  title,
  size = 20,
  className,
}: {
  name: IconName;
  title?: string;
  size?: number;
  className?: string;
}) {
  const labelled = Boolean(title);

  return (
    <svg
      className={[styles.icon, className].filter(Boolean).join(" ")}
      width={size}
      height={size}
      aria-hidden={!labelled}
      aria-label={labelled ? title : undefined}
      role={labelled ? "img" : "presentation"}
      viewBox="0 0 24 24"
    >
      <use href={`/sprite.svg#${name}`} />
    </svg>
  );
}
