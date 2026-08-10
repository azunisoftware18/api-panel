import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";

export class SystemSettingService {
  static async create(userId, payload) {
    const existing = await prisma.systemSetting.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });

    if (existing) {
      throw ApiError.conflict("System settings already exist.");
    }

    return prisma.systemSetting.create({
      data: {
        ...payload,
        userId,
      },
    });
  }

  static async get(userId) {
    return prisma.systemSetting.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });
  }

  static async update(userId, payload) {
    const setting = await prisma.systemSetting.findFirst({
      where: {
        userId,
        deletedAt: null,
      },
    });

    if (!setting) {
      throw ApiError.notFound("System settings not found.");
    }

    return prisma.systemSetting.update({
      where: {
        id: setting.id,
      },
      data: payload,
    });
  }
}
