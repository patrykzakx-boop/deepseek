import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@bookthePlace.pl";
  const adminPassword = "Admin123!";

  const adminPasswordHash = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      name: "Administrator",
      email: adminEmail,
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      onboardingCompleted: true,
      city: "Warszawa",
      phone: "+48 000 000 000",
    },
  });

  console.log("Utworzono/zaktualizowano administratora:");
  console.log(`  email: ${admin.email}`);
  console.log(`  hasło: ${adminPassword}`);
  console.log("Zaloguj się i zmień hasło po pierwszym logowaniu.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
