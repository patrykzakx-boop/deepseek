import Link from "next/link";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

async function getVenues(city?: string) {
  try {
    return await prisma.venue.findMany({
      where: {
        isPublished: true,
        ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      },
      include: { images: true },
      orderBy: { createdAt: "desc" },
    });
  } catch (error) {
    console.error("Błąd połączenia z bazą danych:", error);
    return null;
  }
}

export default async function VenuesPage({
  searchParams,
}: {
  searchParams: Promise<{ city?: string }>;
}) {
  const { city } = await searchParams;
  const venues = await getVenues(city);

  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-3xl font-bold text-zinc-900">Przeglądaj miejsca</h1>

      <form className="mt-6 flex gap-3" action="/venues">
        <input
          type="text"
          name="city"
          defaultValue={city}
          placeholder="Wyszukaj po mieście..."
          className="w-full max-w-sm rounded-lg border border-zinc-300 px-4 py-2"
        />
        <button
          type="submit"
          className="rounded-lg bg-rose-600 px-5 py-2 font-semibold text-white hover:bg-rose-700"
        >
          Szukaj
        </button>
      </form>

      {venues === null && (
        <div className="mt-10 rounded-lg border border-amber-300 bg-amber-50 p-6 text-amber-800">
          <p className="font-semibold">Brak połączenia z bazą danych.</p>
          <p className="mt-1 text-sm">
            Ustaw prawidłowy <code>DATABASE_URL</code> w pliku <code>.env</code>{" "}
            (np. z Neon lub Supabase) i uruchom{" "}
            <code>npx prisma migrate dev</code>.
          </p>
        </div>
      )}

      {venues !== null && venues.length === 0 && (
        <p className="mt-10 text-zinc-600">
          Nie znaleziono żadnych miejsc. Bądź pierwszy i{" "}
          <Link href="/register" className="text-rose-600 underline">
            dodaj swoje miejsce
          </Link>
          !
        </p>
      )}

      {venues !== null && venues.length > 0 && (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {venues.map((venue) => (
            <Link
              key={venue.id}
              href={`/venues/${venue.id}`}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white hover:shadow-lg transition-shadow"
            >
              <div className="h-40 bg-zinc-100 flex items-center justify-center text-zinc-400">
                {venue.images[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={venue.images[0].url}
                    alt={venue.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  "Brak zdjęcia"
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-zinc-900">{venue.name}</h2>
                <p className="text-sm text-zinc-500">
                  {venue.city} · do {venue.capacity} osób
                </p>
                <p className="mt-2 font-semibold text-rose-600">
                  {Number(venue.pricePerDay).toLocaleString("pl-PL")} zł / dzień
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
