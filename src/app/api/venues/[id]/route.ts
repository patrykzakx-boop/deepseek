import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const venue = await prisma.venue.findUnique({
    where: { id },
    include: {
      images: true,
      owner: { select: { name: true, email: true } },
      reviews: { include: { author: { select: { name: true } } } },
      bookings: {
        where: { status: { in: ["PENDING", "CONFIRMED"] } },
        select: { eventDate: true, status: true },
      },
      availability: { where: { isBlocked: true }, select: { date: true } },
    },
  });

  if (!venue) {
    return NextResponse.json({ error: "Nie znaleziono miejsca" }, { status: 404 });
  }

  return NextResponse.json({ venue });
}
