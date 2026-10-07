"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const steps = ["Dane kontaktowe", "O Tobie", "Podsumowanie"];

export default function OnboardingPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    phone: "",
    city: "",
    bio: "",
    companyName: "",
    image: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isOwner = session?.user?.role === "OWNER";

  function next() {
    setError(null);
    if (step === 0 && (!form.phone || !form.city)) {
      setError("Uzupełnij telefon i miasto, aby kontynuować");
      return;
    }
    setStep((s) => Math.min(s + 1, steps.length - 1));
  }

  function back() {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }

  async function handleFinish() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(
        typeof data.error === "string"
          ? data.error
          : Object.values(data.error ?? {}).flat().join(", ") ||
              "Wystąpił błąd"
      );
      return;
    }

    await update({});
    router.push(isOwner ? "/venues/new" : "/venues");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-lg px-6 py-16">
      <div className="mb-8 flex items-center gap-2">
        {steps.map((label, i) => (
          <div key={label} className="flex-1">
            <div
              className={`h-1.5 rounded-full ${
                i <= step ? "bg-rose-600" : "bg-zinc-200"
              }`}
            />
            <p className="mt-2 text-xs text-zinc-500">{label}</p>
          </div>
        ))}
      </div>

      <h1 className="text-2xl font-bold text-zinc-900">
        Uzupełnij swój profil
      </h1>
      <p className="mt-1 text-sm text-zinc-500">
        Potrzebujemy kilku informacji, zanim zaczniesz korzystać z
        BookThePlace.
      </p>

      <div className="mt-8 space-y-4">
        {step === 0 && (
          <>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Numer telefonu
              </label>
              <input
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="+48 600 000 000"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Miasto
              </label>
              <input
                value={form.city}
                onChange={(e) => setForm({ ...form, city: e.target.value })}
                placeholder="Warszawa"
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
          </>
        )}

        {step === 1 && (
          <>
            {isOwner && (
              <div>
                <label className="block text-sm font-medium text-zinc-700">
                  Nazwa firmy (opcjonalnie)
                </label>
                <input
                  value={form.companyName}
                  onChange={(e) =>
                    setForm({ ...form, companyName: e.target.value })
                  }
                  placeholder="Sala Weselna XYZ Sp. z o.o."
                  className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                O sobie (opcjonalnie)
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={4}
                placeholder={
                  isOwner
                    ? "Opisz w kilku słowach swoje miejsca/doświadczenie"
                    : "Napisz coś o sobie"
                }
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700">
                Link do zdjęcia profilowego (opcjonalnie)
              </label>
              <input
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
                placeholder="https://..."
                className="mt-1 w-full rounded-lg border border-zinc-300 px-4 py-2"
              />
            </div>
          </>
        )}

        {step === 2 && (
          <div className="rounded-xl bg-zinc-50 p-4 text-sm text-zinc-700">
            <p>
              <strong>Telefon:</strong> {form.phone || "-"}
            </p>
            <p>
              <strong>Miasto:</strong> {form.city || "-"}
            </p>
            {isOwner && (
              <p>
                <strong>Firma:</strong> {form.companyName || "-"}
              </p>
            )}
            <p>
              <strong>Bio:</strong> {form.bio || "-"}
            </p>
          </div>
        )}

        {error && <p className="text-sm text-red-600">{error}</p>}

        <div className="flex justify-between pt-4">
          {step > 0 ? (
            <button
              onClick={back}
              className="rounded-lg border border-zinc-300 px-5 py-2 text-sm font-medium text-zinc-700 hover:bg-zinc-100"
            >
              Wstecz
            </button>
          ) : (
            <span />
          )}

          {step < steps.length - 1 ? (
            <button
              onClick={next}
              className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Dalej
            </button>
          ) : (
            <button
              onClick={handleFinish}
              disabled={loading}
              className="rounded-lg bg-rose-600 px-5 py-2 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
            >
              {loading ? "Zapisywanie..." : "Zakończ"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
