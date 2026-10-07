"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function OwnerBookingActions({
  bookingId,
  status,
}: {
  bookingId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: "CONFIRMED" | "REJECTED") {
    setLoading(true);
    await fetch(`/api/bookings/${bookingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
    setLoading(false);
    router.refresh();
  }

  if (status !== "PENDING") {
    return (
      <span className="text-xs font-medium text-zinc-500">
        {status === "CONFIRMED" ? "Potwierdzona" : status}
      </span>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => updateStatus("CONFIRMED")}
        className="rounded-full bg-green-600 px-3 py-1 text-xs font-semibold text-white hover:bg-green-700 disabled:opacity-50"
      >
        Potwierdź
      </button>
      <button
        disabled={loading}
        onClick={() => updateStatus("REJECTED")}
        className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-700 hover:bg-zinc-300 disabled:opacity-50"
      >
        Odrzuć
      </button>
    </div>
  );
}
