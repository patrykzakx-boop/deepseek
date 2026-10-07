"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="rounded-full border border-zinc-300 px-3 py-1.5 text-zinc-700 hover:bg-zinc-100"
    >
      Wyloguj
    </button>
  );
}
