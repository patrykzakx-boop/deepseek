import Link from "next/link";
import type { ReactNode } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="text-2xl font-bold text-zinc-900">Panel administratora</h1>

      <div className="mt-6 flex gap-4 border-b border-zinc-200 text-sm font-medium text-zinc-600">
        <Link href="/admin" className="pb-3 hover:text-rose-600">
          Przegląd
        </Link>
        <Link href="/admin/users" className="pb-3 hover:text-rose-600">
          Użytkownicy
        </Link>
        <Link href="/admin/venues" className="pb-3 hover:text-rose-600">
          Miejsca
        </Link>
      </div>

      <div className="mt-8">{children}</div>
    </div>
  );
}
