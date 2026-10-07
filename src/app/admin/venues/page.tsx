import { prisma } from "@/lib/prisma";
import AdminVenueActions from "@/components/AdminVenueActions";

export const dynamic = "force-dynamic";

const statusLabels: Record<string, string> = {
  PENDING_REVIEW: "Oczekuje na akceptację",
  APPROVED: "Zatwierdzone",
  REJECTED: "Odrzucone",
};

export default async function AdminVenuesPage() {
  const venues = await prisma.venue.findMany({
    include: { owner: { select: { name: true, email: true } } },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-4">
      {venues.length === 0 && (
        <p className="text-zinc-600">Brak dodanych miejsc.</p>
      )}

      {venues.map((venue) => (
        <div
          key={venue.id}
          className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4"
        >
          <div>
            <p className="font-semibold text-zinc-900">
              {venue.name} — {venue.city}
            </p>
            <p className="text-sm text-zinc-500">
              Właściciel: {venue.owner.name ?? venue.owner.email}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${
                venue.status === "APPROVED"
                  ? "bg-green-100 text-green-700"
                  : venue.status === "REJECTED"
                  ? "bg-red-100 text-red-700"
                  : "bg-amber-100 text-amber-700"
              }`}
            >
              {statusLabels[venue.status]}
            </span>
          </div>
          <AdminVenueActions venueId={venue.id} status={venue.status} />
        </div>
      ))}
    </div>
  );
}
