import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function AdminOverviewPage() {
  const [userCount, venueCount, pendingVenueCount, bookingCount, pendingBookingCount] =
    await Promise.all([
      prisma.user.count(),
      prisma.venue.count(),
      prisma.venue.count({ where: { status: "PENDING_REVIEW" } }),
      prisma.booking.count(),
      prisma.booking.count({ where: { status: "PENDING" } }),
    ]);

  const stats = [
    { label: "Użytkownicy", value: userCount },
    { label: "Miejsca (wszystkie)", value: venueCount },
    { label: "Miejsca oczekujące na akceptację", value: pendingVenueCount },
    { label: "Rezerwacje (wszystkie)", value: bookingCount },
    { label: "Rezerwacje oczekujące", value: pendingBookingCount },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="rounded-xl border border-zinc-200 bg-white p-5"
        >
          <p className="text-sm text-zinc-500">{s.label}</p>
          <p className="mt-2 text-3xl font-bold text-zinc-900">{s.value}</p>
        </div>
      ))}
    </div>
  );
}
