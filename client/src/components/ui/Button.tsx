import React, {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
} from "react";
import Link from "next/link";
import styles from "./Button.module.css";

type BaseProps = {
  children: React.ReactNode;
  className?: string;
};

type Variant = "primary" | "secondary" | "tertiary" | "tertiary-mono";
type SizeProp = "s" | "m";

type CustomProps = {
  size?: SizeProp;
  small?: boolean;
  medium?: boolean;

  variant?: Variant;
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  tertiaryMono?: boolean;

  pill?: boolean;

  /**
   * Renders a non-interactive element (visual-only) using a span.
   * Useful to avoid nesting interactive elements.
   * Ignored when href is provided.
   */
  displayOnly?: boolean;
};

type LinkProps = {
  href: string;
  target?: string;
  rel?: string;
};

/* Button props */
type ButtonHTMLProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  keyof BaseProps | keyof CustomProps | "href"
> &
  BaseProps &
  CustomProps;

/* Anchor props */
type AnchorHTMLProps = Omit<
  AnchorHTMLAttributes<HTMLAnchorElement>,
  keyof BaseProps | keyof CustomProps
> &
  BaseProps &
  CustomProps &
  LinkProps;

type Props = ButtonHTMLProps | AnchorHTMLProps;

/* Helpers */
type StyleInput = {
  size?: SizeProp;
  small?: boolean;
  medium?: boolean;

  variant?: Variant;
  primary?: boolean;
  secondary?: boolean;
  tertiary?: boolean;
  tertiaryMono?: boolean;

  pill?: boolean;
  userClassName?: string;
};

type StyleOutput = {
  normalizedSize: SizeProp;
  overlayClass: string;
  labelClass: string;
  classes: string;
};

function getButtonStyle({
  size,
  small,
  medium,
  variant,
  primary,
  secondary,
  tertiary,
  tertiaryMono,
  pill,
  userClassName,
}: StyleInput): StyleOutput {
  const normalizedSize: SizeProp = size ?? (small ? "s" : medium ? "m" : "m");

  const effectiveVariant: Variant =
    variant ??
    (primary
      ? "primary"
      : secondary
        ? "secondary"
        : tertiary
          ? "tertiary"
          : tertiaryMono
            ? "tertiary-mono"
            : "primary");

  const effectivePill = pill !== undefined ? !!pill : false;

  const sizeClass = normalizedSize === "s" ? styles.btnS : styles.btnM;
  const overlayClass =
    normalizedSize === "s" ? styles.overlayS : styles.overlayM;
  const labelClass = normalizedSize === "s" ? styles.labelS : styles.labelM;

  const variantClass = styles[`btn--${effectiveVariant}`];
  const pillClass = effectivePill ? styles.btnPill : "";

  const classes =
    `${sizeClass} ${variantClass} ${pillClass} ${userClassName ?? ""}`.trim();

  return { normalizedSize, overlayClass, labelClass, classes };
}

type ChildrenResult = {
  leadingIcon: React.ReactElement | null;
  trailingIcon: React.ReactElement | null;
  processedMiddle: React.ReactNode;
};

function splitChildrenWithIcons(
  children: React.ReactNode,
  labelClass: string,
): ChildrenResult {
  const childArray = React.Children.toArray(children);

  let leadingIcon: React.ReactElement | null = null;
  let trailingIcon: React.ReactElement | null = null;
  const middleChildren: React.ReactNode[] = [];

  childArray.forEach((child, index) => {
    if (React.isValidElement(child)) {
      const element = child as React.ReactElement<{ className?: string }>;
      const className = element.props.className || "";

      if (className.includes("icon")) {
        if (index === 0) {
          leadingIcon = React.cloneElement(element, {
            className: `${className} ${styles.iconLeading}`,
            key: "leading-icon",
          });
          return;
        }
        if (index === childArray.length - 1) {
          trailingIcon = React.cloneElement(element, {
            className: `${className} ${styles.iconTrailing}`,
            key: "trailing-icon",
          });
          return;
        }
      }
    }

    middleChildren.push(child);
  });

  const processedMiddle = middleChildren.map((middleChild, index) => {
    if (typeof middleChild === "string" || typeof middleChild === "number") {
      return (
        <span key={`label-${index}`} className={labelClass}>
          {middleChild}
        </span>
      );
    }

    if (React.isValidElement(middleChild) && middleChild.type === "p") {
      const currentProps = middleChild.props as {
        className?: string;
        children?: React.ReactNode;
      };
      const spanClass = currentProps.className
        ? `${currentProps.className} ${labelClass}`
        : labelClass;

      return (
        <span key={`label-${index}`} className={spanClass}>
          {currentProps.children}
        </span>
      );
    }

    return React.isValidElement(middleChild) ? (
      React.cloneElement(middleChild as React.ReactElement, {
        key: `middle-${index}`,
      })
    ) : (
      <span key={`middle-${index}`}>{middleChild}</span>
    );
  });

  return { leadingIcon, trailingIcon, processedMiddle };
}

const Button: React.FC<Props> = (props) => {
  const {
    children,
    className: userClassName,
    size,
    small,
    medium,
    variant,
    primary,
    secondary,
    tertiary,
    tertiaryMono,
    pill,
    displayOnly,
    ...htmlAttributes
  } = props as Props;

  const { overlayClass, labelClass, classes } = getButtonStyle({
    size,
    small,
    medium,
    variant,
    primary,
    secondary,
    tertiary,
    tertiaryMono,
    pill,
    userClassName,
  });

  const { leadingIcon, trailingIcon, processedMiddle } = splitChildrenWithIcons(
    children,
    labelClass,
  );

  const content = (
    <>
      <span className={overlayClass} aria-hidden="true" />
      <span className={styles.content}>
        {leadingIcon}
        {processedMiddle}
        {trailingIcon}
      </span>
    </>
  );

  const isLink = "href" in (htmlAttributes as any);
  if (isLink) {
    const { href, target, rel, ...anchorRest } =
      htmlAttributes as AnchorHTMLProps;
    const isExternal =
      target === "_blank" || href.startsWith("http") || href.startsWith("//");

    if (isExternal) {
      return (
        <a
          {...anchorRest}
          href={href}
          target={target}
          rel={rel}
          className={classes}
        >
          {content}
        </a>
      );
    }

    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  if (displayOnly) {
    const {
      onClick,
      onKeyDown,
      onKeyUp,
      onKeyPress,
      type,
      disabled,
      tabIndex,
      ...rest
    } = htmlAttributes as ButtonHTMLProps;

    return (
      <span className={classes} aria-disabled="true" tabIndex={-1} {...rest}>
        {content}
      </span>
    );
  }

  const buttonProps = htmlAttributes as ButtonHTMLProps;
  return (
    <button {...buttonProps} className={classes}>
      {content}
    </button>
  );
};

export default Button;
