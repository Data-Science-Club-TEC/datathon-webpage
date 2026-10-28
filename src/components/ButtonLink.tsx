import type { ReactNode } from "react";
import { Link } from "react-router";

type ButtonLinkProps = {
  to: string;
  variant?: "primary" | "secondary";
  children: ReactNode;
};

export default function ButtonLink({
  to,
  variant = "primary",
  children,
}: ButtonLinkProps) {
  return (
    <Link to={to} className={`btn btn-${variant}`}>
      {children}
    </Link>
  );
}
