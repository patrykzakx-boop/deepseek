import Link from "next/link";
import type { Session } from "next-auth";
import SignOutButton from "./SignOutButton";

export default function Navbar({ session }: { session: Session | null }) {
  return (
    <header className="border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-xl font-bold text-rose-600">
          BookThePlace
        </Link>

        <div className="flex items-center gap-4 text-sm font-medium text-zinc-700">
          <Link href="/venues" className="hover:text-rose-600">
            Przeglądaj miejsca
          </Link>

          {session?.user ? (
            <>
              {session.user.role === "ADMIN" && (
                <Link href="/admin" className="hover:text-rose-600">
                  Panel administratora
                </Link>
              )}
              {session.user.role === "OWNER" && (
                <>
                  <Link href="/venues/new" className="hover:text-rose-600">
                    Dodaj miejsce
                  </Link>
                  <Link href="/dashboard" className="hover:text-rose-600">
                    Panel właściciela
                  </Link>
                </>
              )}
              <Link href="/bookings" className="hover:text-rose-600">
                Moje rezerwacje
              </Link>
              <span className="text-zinc-400">|</span>
              <span>{session.user.name ?? session.user.email}</span>
              <SignOutButton />
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-rose-600">
                Zaloguj się
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-rose-600 px-4 py-2 text-white hover:bg-rose-700"
              >
                Zarejestruj się
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
