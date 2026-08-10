import { z } from "zod";

export const systemSettingValidation = z.object({
  companyName: z.string().trim().min(2, "Company Name is required"),

  phoneNumber: z.string().trim().min(10, "Phone Number is required"),

  whtsappNumber: z.string().optional().or(z.literal("")),

  companyEmail: z.string().email("Invalid Email"),

  facebookUrl: z.string().optional().or(z.literal("")),

  instagramUrl: z.string().optional().or(z.literal("")),

  twitterUrl: z.string().optional().or(z.literal("")),

  linkedinUrl: z.string().optional().or(z.literal("")),

  settings: z.any().optional(),
});
