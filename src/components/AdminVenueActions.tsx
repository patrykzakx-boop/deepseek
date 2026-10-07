"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function AdminVenueActions({
  venueId,
  status,
}: {
  venueId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(body: Record<string, unknown>) {
    setLoading(true);
    await fetch(`/api/admin/venues/${venueId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      {status !== "APPROVED" && (
        <button
          disabled={loading}
          onClick={() => patch({ status: "APPROVED" })}
          className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
        >
          Zatwierdź
        </button>
      )}
      {status !== "REJECTED" && (
        <button
          disabled={loading}
          onClick={() =>
            patch({ status: "REJECTED", rejectReason: "Nie spełnia wymagań regulaminu" })
          }
          className="rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white hover:bg-red-700 disabled:opacity-50"
        >
          Odrzuć
        </button>
      )}
    </div>
  );
}
