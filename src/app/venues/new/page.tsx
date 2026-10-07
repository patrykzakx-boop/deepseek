"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import VenueForm from "@/components/VenueForm";

export default function NewVenuePage() {
  const { data: session, status: sessionStatus } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    city: "",
    address: "",
    capacity: 50,
    pricePerDay: 1000,
    amenities: "",
    images: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (sessionStatus === "loading") return null;

  if (!session?.user) {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p>Musisz się zalogować, aby dodać miejsce.</p>
      </div>
    );
  }

  if (session.user.role !== "OWNER") {
    return (
      <div className="mx-auto max-w-md px-6 py-16 text-center">
        <p>
          Twoje konto jest kontem klienta. Aby dodawać miejsca, zarejestruj
          się jako właściciel.
        </p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const res = await fetch("/api/venues", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        amenities: form.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        images: form.images
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
      }),
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

    router.push(`/venues/${data.venue.id}`);
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Dodaj swoje miejsce</h1>
      <VenueForm form={form} setForm={setForm} onSubmit={handleSubmit} error={error} loading={loading} />
    </div>
  );
}
