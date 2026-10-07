import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import OwnerBookingActions from "@/components/OwnerBookingActions";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  if (session.user.role !== "OWNER") redirect("/venues");

  const venues = await prisma.venue.findMany({
    where: { ownerId: session.user.id },
    include: {
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
        include: { customer: { select: { name: true, email: true } } },
        orderBy: { eventDate: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-zinc-900">Panel właściciela</h1>
        <Link
          href="/venues/new"
          className="rounded-full bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700"
        >
          + Dodaj miejsce
        </Link>
      </div>

      {venues.length === 0 ? (
        <p className="mt-8 text-zinc-600">
          Nie masz jeszcze żadnych dodanych miejsc.
        </p>
      ) : (
        <div className="mt-8 space-y-8">
          {venues.map((venue) => (
            <div key={venue.id} className="rounded-xl border border-zinc-200 bg-white p-5">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-zinc-900">{venue.name}</h2>
                <span className="text-sm text-zinc-500">{venue.city}</span>
              </div>

              {venue.bookings.length === 0 ? (
                <p className="mt-3 text-sm text-zinc-500">
                  Brak zapytań o rezerwację.
                </p>
              ) : (
                <div className="mt-4 space-y-3">
                  {venue.bookings.map((b) => (
                    <div
                      key={b.id}
                      className="flex items-center justify-between rounded-lg bg-zinc-50 p-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-zinc-900">
                          {b.customer.name ?? b.customer.email} —{" "}
                          {b.eventDate.toLocaleDateString("pl-PL")} (
                          {b.guests} gości)
                        </p>
                        {b.message && (
                          <p className="text-xs text-zinc-500">
                            „{b.message}”
                          </p>
                        )}
                      </div>
                      <OwnerBookingActions bookingId={b.id} status={b.status} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
