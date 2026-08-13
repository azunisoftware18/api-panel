import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";

export default class ProviderRoutingResolver {
  static async resolve({ apiKeyId, userId, serviceCode }) {
    let mapping;

    // ==========================================
    // API REQUEST
    // ==========================================
    if (apiKeyId) {
      mapping = await prisma.apiKeyProviderMapping.findFirst({
        where: {
          apiKeyId,
          isActive: true,

          serviceProvider: {
            isActive: true,

            service: {
              code: serviceCode,
              isActive: true,
            },
          },
        },

        include: {
          serviceProvider: {
            include: {
              service: true,
              provider: true,
            },
          },
        },

        orderBy: {
          priority: "asc",
        },
      });
    }

    // ==========================================
    // DASHBOARD REQUEST
    // ==========================================
    if (!mapping && userId) {
      const apiKey = await prisma.apiKey.findFirst({
        where: {
          userId,
          isActive: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      if (!apiKey) {
        throw ApiError.badRequest("Active API Key not found");
      }

      mapping = await prisma.apiKeyProviderMapping.findFirst({
        where: {
          apiKeyId: apiKey.id,
          isActive: true,

          serviceProvider: {
            isActive: true,

            service: {
              code: serviceCode,
              isActive: true,
            },
          },
        },

        include: {
          serviceProvider: {
            include: {
              service: true,
              provider: true,
            },
          },
        },

        orderBy: {
          priority: "asc",
        },
      });
    }

    // ==========================================
    // MAPPING NOT FOUND
    // ==========================================
    if (!mapping) {
      throw ApiError.badRequest("API Key provider mapping not found");
    }

    // ==========================================
    // SERVICE PROVIDER
    // ==========================================
    const serviceProvider = mapping.serviceProvider;

    if (!serviceProvider) {
      throw ApiError.badRequest("Service provider not found");
    }

    if (!serviceProvider.isActive) {
      throw ApiError.badRequest("Service provider is inactive");
    }

    if (!serviceProvider.service) {
      throw ApiError.badRequest("Service not found");
    }

    if (!serviceProvider.provider) {
      throw ApiError.badRequest("Provider not found");
    }

    return serviceProvider;
  }
}
