"use client";

type VenueFormState = {
  name: string;
  description: string;
  city: string;
  address: string;
  capacity: number;
  pricePerDay: number;
  amenities: string;
  images: string;
};

export default function VenueForm({
  form,
  setForm,
  onSubmit,
  error,
  loading,
}: {
  form: VenueFormState;
  setForm: (f: VenueFormState) => void;
  onSubmit: (e: React.FormEvent) => void;
  error: string | null;
  loading: boolean;
}) {
  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Nazwa miejsca
        </label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Opis
        </label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Miasto
          </label>
          <input
            required
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Adres
          </label>
          <input
            required
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Pojemność (liczba gości)
          </label>
          <input
            type="number"
            required
            min={1}
            value={form.capacity}
            onChange={(e) =>
              setForm({ ...form, capacity: Number(e.target.value) })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-zinc-700">
            Cena za dzień (zł)
          </label>
          <input
            type="number"
            required
            min={1}
            value={form.pricePerDay}
            onChange={(e) =>
              setForm({ ...form, pricePerDay: Number(e.target.value) })
            }
            className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Udogodnienia (oddzielone przecinkami)
        </label>
        <input
          placeholder="parking, catering, nagłośnienie"
          value={form.amenities}
          onChange={(e) => setForm({ ...form, amenities: e.target.value })}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-zinc-700">
          Linki do zdjęć (URL, oddzielone przecinkami)
        </label>
        <input
          placeholder="https://..., https://..."
          value={form.images}
          onChange={(e) => setForm({ ...form, images: e.target.value })}
          className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
        />
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-lg bg-rose-600 py-2.5 font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
      >
        {loading ? "Dodawanie..." : "Dodaj miejsce"}
      </button>
    </form>
  );
}
