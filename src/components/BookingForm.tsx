"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function BookingForm({
  venueId,
  bookedDates,
}: {
  venueId: string;
  bookedDates: string[];
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [eventDate, setEventDate] = useState("");
  const [guests, setGuests] = useState(10);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">(
    "idle"
  );
  const [error, setError] = useState<string | null>(null);

  const bookedDaySet = new Set(
    bookedDates.map((d) => d.slice(0, 10))
  );
  const isDateTaken = eventDate && bookedDaySet.has(eventDate);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!session?.user) {
      router.push("/login");
      return;
    }

    setStatus("loading");
    setError(null);

    const res = await fetch("/api/bookings", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ venueId, eventDate, guests, message }),
    });

    const data = await res.json();

    if (!res.ok) {
      setStatus("error");
      setError(
        typeof data.error === "string"
          ? data.error
          : Object.values(data.error ?? {}).flat().join(", ") ||
              "Wystąpił błąd"
      );
      return;
    }

    setStatus("success");
  }

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 sticky top-6">
      <h2 className="font-semibold text-zinc-900">Wyślij zapytanie o rezerwację</h2>

      {status === "success" ? (
        <p className="mt-4 text-sm text-green-700">
          Zapytanie wysłane! Właściciel wkrótce je potwierdzi. Sprawdź status w
          zakładce „Moje rezerwacje”.
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          <div>
            <label className="block text-xs font-medium text-zinc-600">
              Data wydarzenia
            </label>
            <input
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
            {isDateTaken && (
              <p className="mt-1 text-xs text-red-600">
                Ten termin jest już zajęty.
              </p>
            )}
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">
              Liczba gości
            </label>
            <input
              type="number"
              required
              min={1}
              value={guests}
              onChange={(e) => setGuests(Number(e.target.value))}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-zinc-600">
              Wiadomość (opcjonalnie)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="mt-1 w-full rounded-lg border border-zinc-300 px-3 py-2 text-sm"
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={status === "loading" || !!isDateTaken}
            className="w-full rounded-lg bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {session?.user
              ? status === "loading"
                ? "Wysyłanie..."
                : "Wyślij zapytanie"
              : "Zaloguj się, aby zarezerwować"}
          </button>
        </form>
      )}
    </div>
  );
}
