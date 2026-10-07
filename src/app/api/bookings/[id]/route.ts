import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { z } from "zod";

const updateSchema = z.object({
  status: z.enum(["CONFIRMED", "REJECTED", "CANCELLED"]),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const booking = await prisma.booking.findUnique({
    where: { id },
    include: { venue: true },
  });

  if (!booking) {
    return NextResponse.json({ error: "Nie znaleziono rezerwacji" }, { status: 404 });
  }

  const isOwner = booking.venue.ownerId === session.user.id;
  const isCustomer = booking.customerId === session.user.id;

  if (!isOwner && !isCustomer) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  // Tylko właściciel może potwierdzać/odrzucać, klient może tylko anulować
  if (parsed.data.status !== "CANCELLED" && !isOwner) {
    return NextResponse.json({ error: "Brak uprawnień" }, { status: 403 });
  }

  const updated = await prisma.booking.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  return NextResponse.json({ booking: updated });
}
