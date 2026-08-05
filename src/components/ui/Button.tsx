import type { ButtonHTMLAttributes } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({ className, ...rest }: ButtonProps) {
  return <button type="button" className={["osda-btn-primary", className].filter(Boolean).join(" ")} {...rest} />;
}

export function SecondaryButton({ className, ...rest }: ButtonProps) {
  return <button type="button" className={["osda-btn-secondary", className].filter(Boolean).join(" ")} {...rest} />;
}
