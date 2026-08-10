import prisma from "../db/db.js";
import { ApiError } from "../utils/ApiError.js";

export default class LedgerEntryService {
  static async create(
    tx,
    {
      walletId,
      transactionId,
      entryType,
      referenceType,
      amount,
      narration,
      createdBy,
      serviceProviderId = null,
      metadata = null,
      idempotencyKey = null,
    }
  ) {
    const wallet = await tx.wallet.findUnique({
      where: { id: walletId },
    });

    if (!wallet) {
      throw ApiError.notFound("Wallet not found");
    }

    if (idempotencyKey) {
      const existing = await tx.ledgerEntry.findUnique({
        where: {
          idempotencyKey,
        },
      });

      if (existing) {
        return existing;
      }
    }

    return tx.ledgerEntry.create({
      data: {
        walletId,
        transactionId,
        entryType,
        referenceType,
        amount: Number(amount),
        runningBalance: Number(wallet.balance),
        narration,
        createdBy,
        serviceProviderId,
        metadata,
        idempotencyKey,
      },
    });
  }

  static async getAll(actor, query) {
    const {
      page = 1,
      limit = 10,
      search,
      entryType,
      referenceType,
      walletType,
      fromDate,
      toDate,
    } = query;

    const where = {};

    // API Holder -> Sirf apne ledger
    if (actor.role === "API_HOLDER") {
      where.wallet = {
        userId: actor.id,
      };
    }

    // Super Admin -> Sabhi ledger
    if (actor.role === "SUPER_ADMIN") {
      where.wallet = {};
    }

    if (entryType) {
      where.entryType = entryType;
    }

    if (referenceType) {
      where.referenceType = referenceType;
    }

    if (walletType) {
      where.wallet = {
        ...(where.wallet || {}),
        walletType,
      };
    }

    if (fromDate || toDate) {
      where.createdAt = {};

      if (fromDate) {
        where.createdAt.gte = new Date(fromDate);
      }

      if (toDate) {
        where.createdAt.lte = new Date(toDate);
      }
    }

    if (search) {
      where.OR = [
        {
          narration: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          transaction: {
            transactionId: {
              contains: search,
              mode: "insensitive",
            },
          },
        },
      ];
    }

    const [items, total] = await prisma.$transaction([
      prisma.ledgerEntry.findMany({
        where,
        include: {
          wallet: {
            include: {
              user: {
                select: {
                  id: true,
                  fullName: true,
                  registrationNumber: true,
                  companyName: true,
                },
              },
            },
          },
          transaction: true,
          serviceProvider: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip: (page - 1) * limit,
        take: Number(limit),
      }),

      prisma.ledgerEntry.count({
        where,
      }),
    ]);

    return {
      items,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
