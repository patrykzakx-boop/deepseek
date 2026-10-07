import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { onboardingSchema } from "@/lib/validations";

export async function POST(req: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json({ error: "Nieautoryzowany" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = onboardingSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { phone, city, bio, companyName, image } = parsed.data;

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: {
      phone,
      city,
      bio,
      companyName,
      image: image || undefined,
      onboardingCompleted: true,
    },
    select: { id: true, onboardingCompleted: true },
  });

  return NextResponse.json({ user });
}
