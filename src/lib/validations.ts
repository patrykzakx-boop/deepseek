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

export const bookingSchema = z.object({
  venueId: z.string().cuid(),
  eventDate: z.coerce.date(),
  guests: z.coerce.number().int().positive(),
  message: z.string().optional(),
});
