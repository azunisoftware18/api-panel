import { z } from "zod";

export const apiKeyProviderMappingValidation = z.object({
  apiKeyId: z.string().min(1, "API Key is required"),
  serviceProviderId: z.string().min(1, "Service Provider ID is required"),
  providerId: z.string().min(1, "Provider is required"),
  priority: z.coerce
    .number({ required_error: "Priority is required" })
    .int("Priority must be a whole number")
    .min(1, "Priority must be at least 1"),
  isActive: z.boolean(),
});
