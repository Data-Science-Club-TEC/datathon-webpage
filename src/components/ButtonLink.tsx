import type { ReactNode } from "react";
import { Link } from "react-router";

const variants = {
  primary: "btn-glow border-blue bg-blue text-navy",
  secondary:
    "border-[rgba(255,255,255,0.3)] bg-[rgba(255,255,255,0.1)] backdrop-blur-sm text-white hover:text-[#9fbfed]",
};

type ButtonLinkProps = {
  to: string;
  variant?: keyof typeof variants;
  children: ReactNode;
};

export default function ButtonLink({
  to,
  variant = "primary",
  children,
}: ButtonLinkProps) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center rounded-full border-2 px-8 py-4 font-poppins font-semibold text-[16px] md:text-lg transition duration-200 ease-out hover:scale-105 ${variants[variant]}`}
    >
      {children}
    </Link>
  );
}
