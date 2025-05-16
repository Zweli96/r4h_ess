"use client";

import Link from "next/link";
import { useContext } from "react";
import { LoadingContext } from "./LoadingContext"; // Adjust path if needed

export default function CustomLink({ href, children, ...props }) {
  const { setIsLoading } = useContext(LoadingContext);

  const handleClick = (e) => {
    console.log("Link clicked, setting isLoading");
    setIsLoading(true);
    if (props.onClick) {
      props.onClick(e);
    }
  };

  return (
    <Link href={href} {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
