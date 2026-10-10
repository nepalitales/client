import React from "react";

type ButtonVariant = "primary" | "secondary" | "outline";
type ButtonSize = "sm" | "default" | "lg";
type ButtonFont = "primary" | "secondary";

interface ButtonBaseProps {
  /** Visual variant */
  variant?: ButtonVariant;
  /** Size preset */
  size?: ButtonSize;
  /** Font family */
  font?: ButtonFont;
  /** Full-width button */
  fullWidth?: boolean;
  /** Optional class overrides */
  className?: string;
  children: React.ReactNode;
}

type ButtonAsButton = ButtonBaseProps &
  Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> & {
    as?: "button";
    href?: never;
  };

type ButtonAsAnchor = ButtonBaseProps &
  Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps> & {
    as: "a";
    href: string;
  };

type ButtonProps = ButtonAsButton | ButtonAsAnchor;

/**
 * Brand button component.
 *
 * Base styling matches the Figma "Frame 586" spec:
 * - Red (#F00011) background with black border (1px solid #000)
 * - 3px 2px box-shadow offset (3px 2px 0px #000)
 * - Pill-shaped (rounded-full)
 * - Centered flex layout
 */
const Button = React.forwardRef<
  HTMLButtonElement | HTMLAnchorElement,
  ButtonProps
>((props, ref) => {
  const {
    variant = "primary",
    size = "default",
    font = "secondary",
    fullWidth = false,
    className = "",
    children,
    ...rest
  } = props;

  const fontStyle = font === "primary" ? "font-primary" : "font-secondary";

  const baseStyles = [
    "inline-flex items-center justify-center",
    "gap-2.5",
    "font-bold tracking-wide uppercase",
    fontStyle,
    "rounded-full",
    "transition-all duration-150 ease-out",
    "cursor-pointer select-none",
    "active:scale-[0.98]",
  ].join(" ");

  const variantStyles: Record<ButtonVariant, string> = {
    primary: [
      "bg-[#D92121] text-white",
      "shadow-sm hover:shadow hover:bg-[#b81b1b]",
    ].join(" "),
    secondary: [
      "bg-accent-green text-white",
      "shadow-sm hover:shadow hover:bg-[#223918]",
    ].join(" "),
    outline: [
      "bg-white text-neutral-800 border border-neutral-300",
      "shadow-sm hover:bg-neutral-50 hover:border-neutral-400",
    ].join(" "),
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "px-5 py-2 text-xs sm:text-sm min-h-[40px] min-w-[120px]",
    default: "px-7 py-2.5 text-sm sm:text-base min-h-[50px] min-w-[180px]",
    lg: "px-9 py-3 text-base sm:text-lg min-h-[60px] min-w-[240px]",
  };

  const widthStyle = fullWidth ? "w-full" : "";

  const combinedClassName = [
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    widthStyle,
    className,
  ]
    .filter(Boolean)
    .join(" ");

  if (props.as === "a") {
    const { as: _, ...anchorProps } = rest as Omit<
      ButtonAsAnchor,
      keyof ButtonBaseProps
    >;
    return (
      <a
        ref={ref as React.Ref<HTMLAnchorElement>}
        className={combinedClassName}
        {...anchorProps}
      >
        {children}
      </a>
    );
  }

  const { as: _, ...buttonProps } = rest as Omit<
    ButtonAsButton,
    keyof ButtonBaseProps
  >;
  return (
    <button
      ref={ref as React.Ref<HTMLButtonElement>}
      className={combinedClassName}
      {...buttonProps}
    >
      {children}
    </button>
  );
});

Button.displayName = "Button";

export { Button };
export type { ButtonProps, ButtonVariant, ButtonSize };
