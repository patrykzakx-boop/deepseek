import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING: "Oczekuje na potwierdzenie",
  CONFIRMED: "Potwierdzona",
  CANCELLED: "Anulowana",
  REJECTED: "Odrzucona",
};

export default async function BookingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: { venue: { select: { name: true, city: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Moje rezerwacje</h1>

      {bookings.length === 0 ? (
        <p className="mt-6 text-zinc-600">Nie masz jeszcze żadnych rezerwacji.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {bookings.map((b) => (
            <div
              key={b.id}
              className="rounded-xl border border-zinc-200 bg-white p-4 flex items-center justify-between"
            >
              <div>
                <p className="font-semibold text-zinc-900">
                  {b.venue.name} — {b.venue.city}
                </p>
                <p className="text-sm text-zinc-500">
                  Data: {b.eventDate.toLocaleDateString("pl-PL")} · Goście:{" "}
                  {b.guests}
                </p>
              </div>
              <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-700">
                {statusLabels[b.status]}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
