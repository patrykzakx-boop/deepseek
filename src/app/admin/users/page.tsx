import { prisma } from "@/lib/prisma";
import AdminUserActions from "@/components/AdminUserActions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      onboardingCompleted: true,
      createdAt: true,
    },
  });

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-zinc-200 bg-zinc-50 text-zinc-600">
          <tr>
            <th className="px-4 py-3">Imię</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Rola</th>
            <th className="px-4 py-3">Profil</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Akcje</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id} className="border-b border-zinc-100">
              <td className="px-4 py-3">{u.name ?? "-"}</td>
              <td className="px-4 py-3">{u.email}</td>
              <td className="px-4 py-3">{u.role}</td>
              <td className="px-4 py-3">
                {u.onboardingCompleted ? "Uzupełniony" : "Niekompletny"}
              </td>
              <td className="px-4 py-3">
                {u.isBanned ? (
                  <span className="rounded-full bg-red-100 px-2 py-1 text-xs text-red-700">
                    Zbanowany
                  </span>
                ) : (
                  <span className="rounded-full bg-green-100 px-2 py-1 text-xs text-green-700">
                    Aktywny
                  </span>
                )}
              </td>
              <td className="px-4 py-3">
                <AdminUserActions user={u} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
