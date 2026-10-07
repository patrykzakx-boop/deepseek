import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { adminUpdateUserSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN") {
    return null;
  }
  return session;
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAdmin();
  if (!session) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = adminUpdateUserSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  if (id === session.user.id && parsed.data.role && parsed.data.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Nie możesz odebrać uprawnień administratora samemu sobie" },
      { status: 400 }
    );
  }

  const user = await prisma.user.update({
    where: { id },
    data: parsed.data,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      isBanned: true,
      banReason: true,
    },
  });

  return NextResponse.json({ user });
}
