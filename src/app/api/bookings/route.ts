import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { bookingSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Musisz się zalogować, aby wysłać zapytanie o rezerwację" },
      { status: 401 }
    );
  }

  const body = await req.json();
  const parsed = bookingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { venueId, eventDate, guests, message } = parsed.data;

  const venue = await prisma.venue.findUnique({ where: { id: venueId } });
  if (!venue) {
    return NextResponse.json({ error: "Nie znaleziono miejsca" }, { status: 404 });
  }

  const existing = await prisma.booking.findFirst({
    where: {
      venueId,
      eventDate,
      status: { in: ["PENDING", "CONFIRMED"] },
    },
  });

  if (existing) {
    return NextResponse.json(
      { error: "Ten termin jest już zajęty lub oczekuje na potwierdzenie" },
      { status: 409 }
    );
  }

  const booking = await prisma.booking.create({
    data: {
      venueId,
      eventDate,
      guests,
      message,
      customerId: session.user.id,
    },
  });

  return NextResponse.json({ booking }, { status: 201 });
}

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
  }

  const bookings = await prisma.booking.findMany({
    where: { customerId: session.user.id },
    include: { venue: { select: { name: true, city: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ bookings });
}
