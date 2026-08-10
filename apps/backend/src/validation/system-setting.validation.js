import { z } from "zod";

export const createSystemSettingValidation = z.object({
  companyName: z.string().min(2),
  companyLogo: z.string(),
  favIcon: z.string(),
  phoneNumber: z.string(),
  whtsappNumber: z.string().optional(),
  companyEmail: z.string().email(),
  facebookUrl: z.string().optional(),
  instagramUrl: z.string().optional(),
  twitterUrl: z.string().optional(),
  linkedinUrl: z.string().optional(),
  settings: z.any().optional(),
});

export const updateSystemSettingValidation =
  createSystemSettingValidation.partial();
