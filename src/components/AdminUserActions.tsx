"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type User = {
  id: string;
  role: string;
  isBanned: boolean;
};

export default function AdminUserActions({ user }: { user: User }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    await fetch(`/api/admin/users/${user.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex flex-wrap gap-2">
      <select
        defaultValue={user.role}
        disabled={loading}
        onChange={(e) => patch({ role: e.target.value })}
        className="rounded-lg border border-zinc-300 px-2 py-1 text-xs"
      >
        <option value="CUSTOMER">CUSTOMER</option>
        <option value="OWNER">OWNER</option>
        <option value="ADMIN">ADMIN</option>
      </select>

      {user.isBanned ? (
        <button
          disabled={loading}
          onClick={() => patch({ isBanned: false, banReason: null })}
          className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          Odbanuj
        </button>
      ) : (
        <button
          disabled={loading}
          onClick={() => patch({ isBanned: true, banReason: "Naruszenie regulaminu" })}
          className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Zbanuj
        </button>
      )}
    </div>
  );
}
