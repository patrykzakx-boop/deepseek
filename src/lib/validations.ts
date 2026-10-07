import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Imię musi mieć co najmniej 2 znaki"),
  email: z.string().email("Nieprawidłowy adres email"),
  password: z.string().min(6, "Hasło musi mieć co najmniej 6 znaków"),
  role: z.enum(["CUSTOMER", "OWNER"]).default("CUSTOMER"),
});

export const venueSchema = z.object({
  name: z.string().min(3, "Nazwa musi mieć co najmniej 3 znaki"),
  description: z.string().min(10, "Opis musi mieć co najmniej 10 znaków"),
  city: z.string().min(2, "Podaj miasto"),
  address: z.string().min(3, "Podaj adres"),
  capacity: z.coerce.number().int().positive("Pojemność musi być większa od 0"),
  pricePerDay: z.coerce.number().positive("Cena musi być większa od 0"),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string().url()).default([]),
});

export const onboardingSchema = z.object({
  phone: z.string().min(6, "Podaj prawidłowy numer telefonu"),
  city: z.string().min(2, "Podaj miasto"),
  bio: z.string().max(500).optional(),
  companyName: z.string().optional(),
  image: z.string().url().optional().or(z.literal("")),
});

export const adminUpdateUserSchema = z.object({
  role: z.enum(["CUSTOMER", "OWNER", "ADMIN"]).optional(),
  isBanned: z.boolean().optional(),
  banReason: z.string().optional(),
});

export const adminUpdateVenueSchema = z.object({
  status: z.enum(["PENDING_REVIEW", "APPROVED", "REJECTED"]),
  rejectReason: z.string().optional(),
});

export const bookingSchema = z.object({
  venueId: z.string().cuid(),
  eventDate: z.coerce.date(),
  guests: z.coerce.number().int().positive(),
  message: z.string().optional(),
});
