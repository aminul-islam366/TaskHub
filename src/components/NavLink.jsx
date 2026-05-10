"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NavLink = ({ link }) => {
  const pathname = usePathname();

  const isActive = pathname === link.href;

  return (
    <Link
      href={link.href}
      className={`font-medium transition pb-1 border-transparent border-b-2 px-2
        ${isActive ? "text-white border-white " : "text-indigo-100  hover:text-white"}`}
    >
      {link.name}
    </Link>
  );
};

export default NavLink;
