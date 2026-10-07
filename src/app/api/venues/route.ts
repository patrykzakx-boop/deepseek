import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { venueSchema } from "@/lib/validations";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const city = searchParams.get("city") ?? undefined;
  const minCapacity = searchParams.get("minCapacity");

  const venues = await prisma.venue.findMany({
    where: {
      isPublished: true,
      ...(city ? { city: { contains: city, mode: "insensitive" } } : {}),
      ...(minCapacity ? { capacity: { gte: Number(minCapacity) } } : {}),
    },
    include: { images: true, owner: { select: { name: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ venues });
}

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "OWNER") {
    return NextResponse.json(
      { error: "Tylko właściciele miejsc mogą dodawać ogłoszenia" },
      { status: 403 }
    );
  }

  const body = await req.json();
  const parsed = venueSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { images, ...data } = parsed.data;

  const venue = await prisma.venue.create({
    data: {
      ...data,
      ownerId: session.user.id,
      images: { create: images.map((url) => ({ url })) },
    },
    include: { images: true },
  });

  return NextResponse.json({ venue }, { status: 201 });
}
