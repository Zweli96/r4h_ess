"use client";
import styles from "./page.module.css";
import Switch from "@mui/material/Switch";
import Link from "@mui/material/Link";
import NextLink from "next/link";
import { signIn } from "next-auth/react";

const label = { inputProps: { "aria-label": "Switch demo" } };

export default function Home() {
  return (
    <div className={styles.container}>
      <button
        onClick={() => {
          signIn();
        }}
      >
        Login
      </button>
    </div>
  );
}
