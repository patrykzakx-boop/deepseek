import Link from "next/link";

export default function Home() {
  return (
    <div className="bg-white">
      <section className="mx-auto max-w-6xl px-6 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
          Znajdź idealne miejsce na swoją{" "}
          <span className="text-rose-600">imprezę okolicznościową</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-zinc-600">
          Sale weselne, lokale na urodziny, konferencje i spotkania firmowe —
          sprawdź dostępne terminy i zarezerwuj miejsce w kilka minut.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/venues"
            className="rounded-full bg-rose-600 px-6 py-3 text-white font-semibold hover:bg-rose-700"
          >
            Przeglądaj miejsca
          </Link>
          <Link
            href="/register"
            className="rounded-full border border-zinc-300 px-6 py-3 font-semibold text-zinc-800 hover:bg-zinc-100"
          >
            Dodaj swoje miejsce
          </Link>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="grid gap-8 sm:grid-cols-3">
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold">Wyszukaj</h3>
            <p className="mt-2 text-zinc-600">
              Filtruj miejsca po mieście, pojemności i terminie, aby znaleźć
              dopasowaną salę.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold">Sprawdź dostępność</h3>
            <p className="mt-2 text-zinc-600">
              Każde miejsce ma widoczny kalendarz z wolnymi i zajętymi
              terminami.
            </p>
          </div>
          <div className="rounded-2xl border border-zinc-200 p-6">
            <h3 className="text-lg font-semibold">Zarezerwuj</h3>
            <p className="mt-2 text-zinc-600">
              Wyślij zapytanie o rezerwację, a właściciel miejsca je
              potwierdzi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

