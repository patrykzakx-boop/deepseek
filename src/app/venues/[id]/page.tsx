import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import BookingForm from "@/components/BookingForm";

export const dynamic = "force-dynamic";

export default async function VenueDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const venue = await prisma.venue.findUnique({
    where: { id },
    include: {
      images: true,
      owner: { select: { name: true } },
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
        select: { eventDate: true },
      },
    },
  });

  if (!venue) notFound();

  const bookedDates = venue.bookings.map((b) => b.eventDate.toISOString());

  return (
    <div className="mx-auto max-w-5xl px-6 py-12">
      <div className="grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="h-72 overflow-hidden rounded-2xl bg-zinc-100">
            {venue.images[0] ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={venue.images[0].url}
                alt={venue.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-zinc-400">
                Brak zdjęcia
              </div>
            )}
          </div>

          <h1 className="mt-6 text-3xl font-bold text-zinc-900">
            {venue.name}
          </h1>
          <p className="mt-1 text-zinc-500">
            {venue.address}, {venue.city}
          </p>

          <div className="mt-4 flex gap-6 text-sm text-zinc-600">
            <span>Pojemność: do {venue.capacity} osób</span>
            <span>
              Cena: {Number(venue.pricePerDay).toLocaleString("pl-PL")} zł /
              dzień
            </span>
            <span>Właściciel: {venue.owner.name}</span>
          </div>

          {venue.amenities.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {venue.amenities.map((a) => (
                <span
                  key={a}
                  className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-700"
                >
                  {a}
                </span>
              ))}
            </div>
          )}

          <p className="mt-6 whitespace-pre-line text-zinc-700">
            {venue.description}
          </p>
        </div>

        <div>
          <BookingForm venueId={venue.id} bookedDates={bookedDates} />
        </div>
      </div>
    </div>
  );
}
