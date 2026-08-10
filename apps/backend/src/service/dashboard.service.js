import prisma from "../db/db.js";

class DashboardService {
  static async getDashboard(actor) {

    const commission = await this.getCommissionSummary(actor);

    const [
      wallet,
      today,
      month,
      transactions,
      services,
      fundRequests,
      kyc,
      users,
      apiUsage,
      providerHealth,
      recentTransactions,
      recentFundRequests,
      recentKyc,
      notifications,
      analytics,
    ] = await Promise.all([
      this.getWalletSummary(actor),
      this.getTodaySummary(actor),
      this.getMonthlySummary(actor),
      this.getTransactionSummary(actor),
      this.getServiceSummary(actor),
      this.getFundRequestSummary(actor),
      this.getKycSummary(actor),
      this.getUserSummary(actor),
      this.getApiUsageSummary(actor),
      this.getProviderHealth(actor),
      this.getRecentTransactions(actor),
      this.getRecentFundRequests?.(actor) ?? Promise.resolve([]),
      this.getRecentKyc(actor),
      this.getNotifications(actor),
      this.getAnalytics(actor),
    ]);

    const profit = {
      grossProfit: commission.totalCommission,
      netProfit: commission.totalCommission,
      todayProfit: commission.todayCommission,
      monthlyProfit: commission.monthlyCommission,
    };

    return {
      wallet,
      today,
      month,
      transactions,
      services,
      fundRequests,
      kyc,
      users,
      apiUsage,
      providerHealth,
      commission,
      profit,
      recentTransactions,
      recentFundRequests,
      recentKyc,
      notifications,
      analytics,
    };
  }

  // ==========================================================
  // Wallet Summary
  // ==========================================================

  static async getWalletSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    const wallets = await prisma.wallet.findMany({
      where,
      select: {
        walletType: true,
        balance: true,
        holdBalance: true,
      },
    });

    // SUPER ADMIN
    if (actor.role == "SUPER_ADMIN") {
      const summary = {
        totalWallets: wallets.length,

        primaryBalance: 0,
        commissionBalance: 0,
        escrowBalance: 0,
        bonusBalance: 0,
        gstBalance: 0,
        tdsBalance: 0,

        totalBalance: 0,
        totalHoldBalance: 0,
        totalAvailableBalance: 0,
      };

      for (const wallet of wallets) {
        summary.totalBalance += wallet.balance;
        summary.totalHoldBalance += wallet.holdBalance;
        summary.totalAvailableBalance += wallet.balance - wallet.holdBalance;

        switch (wallet.walletType) {
          case "PRIMARY":
            summary.primaryBalance += wallet.balance;
            break;

          case "COMMISSION":
            summary.commissionBalance += wallet.balance;
            break;

          case "GST":
            summary.gstBalance += wallet.balance;
            break;

          case "TDS":
            summary.tdsBalance += wallet.balance;
            break;
        }
      }

      return summary;
    }

    // USER
    const summary = {
      primaryBalance: 0,
      commissionBalance: 0,
      gstBalance: 0,
      tdsBalance: 0,

      totalBalance: 0,
      holdBalance: 0,
      availableBalance: 0,
    };

    for (const wallet of wallets) {
      summary.totalBalance += wallet.balance;
      summary.holdBalance += wallet.holdBalance;
      summary.availableBalance += wallet.balance - wallet.holdBalance;

      switch (wallet.walletType) {
        case "PRIMARY":
          summary.primaryBalance = wallet.balance;
          break;

        case "COMMISSION":
          summary.commissionBalance = wallet.balance;
          break;

        case "GST":
          summary.gstBalance = wallet.balance;
          break;

        case "TDS":
          summary.tdsBalance = wallet.balance;
          break;
      }
    }

    return summary;
  }

  // ==========================================================
  // Today's Summary
  // ==========================================================

  static async getTodaySummary(actor) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const transactionWhere = {
      initiatedAt: {
        gte: startOfDay,
      },
    };

    const commissionWhere = {
      createdAt: {
        gte: startOfDay,
      },
    };

    if (actor.role !== "SUPER_ADMIN") {
      transactionWhere.userId = actor.id;
      commissionWhere.userId = actor.id;
    }

    const [
      totalTxn,
      successTxn,
      failedTxn,
      pendingTxn,
      volume,
      netVolume,
      commission,
    ] = await Promise.all([
      prisma.transaction.count({
        where: transactionWhere,
      }),

      prisma.transaction.count({
        where: {
          ...transactionWhere,
          status: "SUCCESS",
        },
      }),

      prisma.transaction.count({
        where: {
          ...transactionWhere,
          status: "FAILED",
        },
      }),

      prisma.transaction.count({
        where: {
          ...transactionWhere,
          status: "PENDING",
        },
      }),

      prisma.transaction.aggregate({
        where: transactionWhere,
        _sum: {
          amount: true,
        },
      }),

      prisma.transaction.aggregate({
        where: transactionWhere,
        _sum: {
          netAmount: true,
        },
      }),

      prisma.commissionEarning.aggregate({
        where: commissionWhere,
        _sum: {
          amount: true,
        },
      }),
    ]);

    const transactionCount = totalTxn || 0;
    const successCount = successTxn || 0;
    const failedCount = failedTxn || 0;
    const pendingCount = pendingTxn || 0;

    const totalVolume = volume._sum.amount || 0;
    const totalNetVolume = netVolume._sum.netAmount || 0;
    const totalCommission = commission._sum.amount || 0;

    const successRate =
      transactionCount === 0
        ? 0
        : Number(((successCount / transactionCount) * 100).toFixed(2));

    return {
      transactions: transactionCount,
      success: successCount,
      failed: failedCount,
      pending: pendingCount,
      successRate,
      volume: totalVolume,
      netVolume: totalNetVolume,
      commission: totalCommission,
    };
  }

  // ==========================================================
  // Monthly Summary
  // ==========================================================

  static async getMonthlySummary(actor) {
    const now = new Date();

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const startOfPreviousMonth = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1
    );

    const transactionWhere = {
      initiatedAt: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    };

    const previousTransactionWhere = {
      initiatedAt: {
        gte: startOfPreviousMonth,
        lt: startOfMonth,
      },
    };

    const commissionWhere = {
      createdAt: {
        gte: startOfMonth,
        lt: startOfNextMonth,
      },
    };

    if (actor.role !== "SUPER_ADMIN") {
      transactionWhere.userId = actor.id;
      previousTransactionWhere.userId = actor.id;
      commissionWhere.userId = actor.id;
    }

    const [
      currentTransactions,
      previousTransactions,
      volume,
      netVolume,
      commission,
    ] = await Promise.all([
      prisma.transaction.count({
        where: transactionWhere,
      }),

      prisma.transaction.count({
        where: previousTransactionWhere,
      }),

      prisma.transaction.aggregate({
        where: transactionWhere,
        _sum: {
          amount: true,
        },
      }),

      prisma.transaction.aggregate({
        where: transactionWhere,
        _sum: {
          netAmount: true,
        },
      }),

      prisma.commissionEarning.aggregate({
        where: commissionWhere,
        _sum: {
          amount: true,
        },
      }),
    ]);

    const totalVolume = volume._sum.amount || 0;
    const totalNetVolume = netVolume._sum.netAmount || 0;
    const totalCommission = commission._sum.amount || 0;

    const averageTicketSize =
      currentTransactions === 0
        ? 0
        : Number((totalVolume / currentTransactions).toFixed(2));

    const averageTransactionsPerDay = Number(
      (currentTransactions / now.getDate()).toFixed(2)
    );

    let growthPercentage = 0;

    if (previousTransactions > 0) {
      growthPercentage = Number(
        (
          ((currentTransactions - previousTransactions) /
            previousTransactions) *
          100
        ).toFixed(2)
      );
    }

    return {
      transactions: currentTransactions,
      volume: totalVolume,
      netVolume: totalNetVolume,
      commission: totalCommission,

      averageTicketSize,
      averageTransactionsPerDay,

      growthPercentage,
      previousMonthTransactions: previousTransactions,
    };
  }

  // ==========================================================
  // User Summary
  // ==========================================================

  static async getUserSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.parentId = actor.id;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      kycVerifiedUsers,
      todayUsers,
    ] = await Promise.all([
      prisma.user.count({
        where,
      }),

      prisma.user.count({
        where: {
          ...where,
          status: "ACTIVE",
        },
      }),

      prisma.user.count({
        where: {
          ...where,
          status: "IN_ACTIVE",
        },
      }),

      prisma.user.count({
        where: {
          ...where,
          isKycVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          ...where,
          createdAt: {
            gte: today,
          },
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      kycVerifiedUsers,
      todayUsers,
    };
  }

  // ==========================================================
  // KYC Summary
  // ==========================================================

  static async getKycSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.user = {
        parentId: actor.id,
      };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, pending, verified, rejected, todayCount] = await Promise.all([
      prisma.kyc.count({
        where,
      }),

      prisma.kyc.count({
        where: {
          ...where,
          status: "PENDING",
        },
      }),

      prisma.kyc.count({
        where: {
          ...where,
          status: "VERIFIED",
        },
      }),

      prisma.kyc.count({
        where: {
          ...where,
          status: "REJECTED",
        },
      }),

      prisma.kyc.count({
        where: {
          ...where,
          createdAt: {
            gte: today,
          },
        },
      }),
    ]);

    return {
      total,
      pending,
      verified,
      rejected,
      today: todayCount,
    };
  }

  // ==========================================================
  // Fund Request Summary
  // ==========================================================

  static async getFundRequestSummary(actor) {
    // Change prisma.fundRequest to your actual model name if different

    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const [total, pending, approved, rejected, todayCount] =
        await Promise.all([
          prisma.fundRequest.count({
            where,
          }),

          prisma.fundRequest.count({
            where: {
              ...where,
              status: "PENDING",
            },
          }),

          prisma.fundRequest.count({
            where: {
              ...where,
              status: "APPROVED",
            },
          }),

          prisma.fundRequest.count({
            where: {
              ...where,
              status: "REJECTED",
            },
          }),

          prisma.fundRequest.count({
            where: {
              ...where,
              createdAt: {
                gte: today,
              },
            },
          }),
        ]);

      return {
        total,
        pending,
        approved,
        rejected,
        today: todayCount,
      };
    } catch {
      return {
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        today: 0,
      };
    }
  }

  // ==========================================================
  // Transaction Summary
  // ==========================================================

  static async getTransactionSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    const [total, success, failed, pending, cancelled, amount, netAmount] =
      await Promise.all([
        prisma.transaction.count({
          where,
        }),

        prisma.transaction.count({
          where: {
            ...where,
            status: "SUCCESS",
          },
        }),

        prisma.transaction.count({
          where: {
            ...where,
            status: "FAILED",
          },
        }),

        prisma.transaction.count({
          where: {
            ...where,
            status: "PENDING",
          },
        }),

        prisma.transaction.count({
          where: {
            ...where,
            status: "CANCELLED",
          },
        }),

        prisma.transaction.aggregate({
          where,
          _sum: {
            amount: true,
          },
        }),

        prisma.transaction.aggregate({
          where,
          _sum: {
            netAmount: true,
          },
        }),
      ]);

    return {
      totalTransactions: total,

      successTransactions: success,

      failedTransactions: failed,

      pendingTransactions: pending,

      cancelledTransactions: cancelled,

      totalAmount: amount._sum.amount || 0,

      totalNetAmount: netAmount._sum.netAmount || 0,

      successRate:
        total === 0 ? 0 : Number(((success / total) * 100).toFixed(2)),
    };
  }

  // ==========================================================
  // Service Summary
  // ==========================================================

  static async getServiceSummary(actor) {
    const transactionWhere = {};

    if (actor.role !== "SUPER_ADMIN") {
      transactionWhere.userId = actor.id;
    }

    const services = await prisma.serviceProvider.findMany({
      include: {
        service: true,
        provider: true,

        _count: {
          select: {
            transactions: {
              where: transactionWhere,
            },
          },
        },
      },
    });

    return services.map((item) => ({
      serviceId: item.service.id,
      serviceName: item.service.name,
      serviceCode: item.service.code,

      providerId: item.provider.id,
      providerName: item.provider.name,

      totalTransactions: item._count.transactions,
    }));
  }

  /**
   * ============================================================
   * USER SUMMARY
   * ============================================================
   */
  static async getUserSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.parentId = actor.id;
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [
      totalUsers,
      activeUsers,
      inactiveUsers,
      kycVerifiedUsers,
      todayUsers,
    ] = await Promise.all([
      prisma.user.count({
        where,
      }),

      prisma.user.count({
        where: {
          ...where,
          status: "ACTIVE",
        },
      }),

      prisma.user.count({
        where: {
          ...where,
          status: "IN_ACTIVE",
        },
      }),

      prisma.user.count({
        where: {
          ...where,
          isKycVerified: true,
        },
      }),

      prisma.user.count({
        where: {
          ...where,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
    ]);

    return {
      totalUsers,
      activeUsers,
      inactiveUsers,
      kycVerifiedUsers,
      todayUsers,
    };
  }

  /**
   * ============================================================
   * KYC SUMMARY
   * ============================================================
   */
  static async getKycSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.user = {
        parentId: actor.id,
      };
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const [total, pending, verified, rejected, today] = await Promise.all([
      prisma.kyc.count({
        where,
      }),

      prisma.kyc.count({
        where: {
          ...where,
          status: "PENDING",
        },
      }),

      prisma.kyc.count({
        where: {
          ...where,
          status: "VERIFIED",
        },
      }),

      prisma.kyc.count({
        where: {
          ...where,
          status: "REJECTED",
        },
      }),

      prisma.kyc.count({
        where: {
          ...where,
          createdAt: {
            gte: startOfToday,
          },
        },
      }),
    ]);

    return {
      total,
      pending,
      verified,
      rejected,
      today,
    };
  }

  /**
   * ============================================================
   * FUND REQUEST SUMMARY
   * ============================================================
   * Placeholder until FundRequest model exists
   */
  static async getFundRequestSummary() {
    return {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      today: 0,
    };
  }

  /**
   * ============================================================
   * TRANSACTION SUMMARY
   * ============================================================
   */
  static async getTransactionSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    const [total, success, failed, pending, amount, netAmount] =
      await Promise.all([
        prisma.transaction.count({ where }),

        prisma.transaction.count({
          where: {
            ...where,
            status: "SUCCESS",
          },
        }),

        prisma.transaction.count({
          where: {
            ...where,
            status: "FAILED",
          },
        }),

        prisma.transaction.count({
          where: {
            ...where,
            status: "PENDING",
          },
        }),

        prisma.transaction.aggregate({
          where,
          _sum: {
            amount: true,
          },
        }),

        prisma.transaction.aggregate({
          where,
          _sum: {
            netAmount: true,
          },
        }),
      ]);

    return {
      totalTransactions: total,
      successTransactions: success,
      failedTransactions: failed,
      pendingTransactions: pending,

      totalAmount: amount._sum.amount ?? 0,
      totalNetAmount: netAmount._sum.netAmount ?? 0,

      successRate:
        total === 0 ? 0 : Number(((success / total) * 100).toFixed(2)),
    };
  }

  /**
   * ============================================================
   * SERVICE SUMMARY
   * ============================================================
   */
  static async getServiceSummary(actor) {
    const transactionWhere = {};

    if (actor.role !== "SUPER_ADMIN") {
      transactionWhere.userId = actor.id;
    }

    const serviceProviders = await prisma.serviceProvider.findMany({
      include: {
        service: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        provider: {
          select: {
            id: true,
            name: true,
            code: true,
          },
        },

        _count: {
          select: {
            transactions: {
              where: transactionWhere,
            },
          },
        },
      },
    });

    return serviceProviders.map((item) => ({
      serviceId: item.service.id,
      serviceName: item.service.name,
      serviceCode: item.service.code,

      providerId: item.provider.id,
      providerName: item.provider.name,
      providerCode: item.provider.code,

      totalTransactions: item._count.transactions,
    }));
  }

  /**
   * ============================================================
   * COMMISSION SUMMARY
   * ============================================================
   */
  static async getCommissionSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      startOfToday.getFullYear(),
      startOfToday.getMonth(),
      1
    );

    const [totalCommission, todayCommission, monthlyCommission] =
      await Promise.all([
        prisma.commissionEarning.aggregate({
          where,
          _sum: {
            amount: true,
          },
        }),

        prisma.commissionEarning.aggregate({
          where: {
            ...where,
            createdAt: {
              gte: startOfToday,
            },
          },
          _sum: {
            amount: true,
          },
        }),

        prisma.commissionEarning.aggregate({
          where: {
            ...where,
            createdAt: {
              gte: startOfMonth,
            },
          },
          _sum: {
            amount: true,
          },
        }),
      ]);

    return {
      totalCommission: totalCommission._sum.amount ?? 0,

      todayCommission: todayCommission._sum.amount ?? 0,

      monthlyCommission: monthlyCommission._sum.amount ?? 0,
    };
  }

  /**
   * ============================================================
   * PROFIT SUMMARY
   * ============================================================
   *
   * NOTE:
   * Current schema does not store actual profit.
   * Using commission as temporary profit.
   */
  static async getProfitSummary(actor) {
    const commission = await this.getCommissionSummary(actor);

    return {
      grossProfit: commission.totalCommission,

      netProfit: commission.totalCommission,

      todayProfit: commission.todayCommission,

      monthlyProfit: commission.monthlyCommission,
    };
  }

  /**
   * ============================================================
   * API USAGE SUMMARY
   * ============================================================
   */
  static async getApiUsageSummary(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    const [totalKeys, activeKeys, inactiveKeys, expiredKeys, recentKeys] =
      await Promise.all([
        prisma.apiKey.count({ where }),

        prisma.apiKey.count({
          where: {
            ...where,
            isActive: true,
          },
        }),

        prisma.apiKey.count({
          where: {
            ...where,
            isActive: false,
          },
        }),

        prisma.apiKey.count({
          where: {
            ...where,
            expiresAt: {
              lt: new Date(),
            },
          },
        }),

        prisma.apiKey.findMany({
          where,
          take: 5,
          orderBy: {
            lastUsedAt: "desc",
          },
          select: {
            id: true,
            name: true,
            provider: true,
            lastUsedAt: true,
            requestsPerMinute: true,
            requestsPerDay: true,
            isActive: true,
          },
        }),
      ]);

    return {
      totalKeys,
      activeKeys,
      inactiveKeys,
      expiredKeys,
      recentKeys,
    };
  }

  /**
   * ============================================================
   * PROVIDER HEALTH
   * ============================================================
   */
  static async getProviderHealth(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    const providers = await prisma.serviceProvider.findMany({
      include: {
        provider: {
          select: {
            id: true,
            name: true,
          },
        },

        service: {
          select: {
            id: true,
            name: true,
          },
        },

        transactions: {
          where,
          select: {
            status: true,
          },
        },
      },
    });

    return providers.map((item) => {
      let success = 0;
      let failed = 0;
      let pending = 0;

      for (const txn of item.transactions) {
        switch (txn.status) {
          case "SUCCESS":
            success++;
            break;

          case "FAILED":
            failed++;
            break;

          default:
            pending++;
        }
      }

      const total = item.transactions.length;

      return {
        providerId: item.provider.id,
        providerName: item.provider.name,

        serviceId: item.service.id,
        serviceName: item.service.name,

        totalTransactions: total,

        success,
        failed,
        pending,

        successRate:
          total === 0 ? 0 : Number(((success / total) * 100).toFixed(2)),
      };
    });
  }

  /**
   * ============================================================
   * RECENT TRANSACTIONS
   * ============================================================
   */
  static async getRecentTransactions(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    return prisma.transaction.findMany({
      where,

      take: 10,

      orderBy: {
        initiatedAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
          },
        },

        wallet: {
          select: {
            walletType: true,
          },
        },

        serviceProvider: {
          include: {
            service: {
              select: {
                name: true,
              },
            },

            provider: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * ============================================================
   * RECENT KYC
   * ============================================================
   */
  static async getRecentKyc(actor) {
    const where = {};

    if (actor.role !== "SUPER_ADMIN") {
      where.user = {
        parentId: actor.id,
      };
    }

    return prisma.kyc.findMany({
      where,

      take: 10,

      orderBy: {
        createdAt: "desc",
      },

      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            companyName: true,
          },
        },
      },
    });
  }

  /**
   * ============================================================
   * NOTIFICATIONS
   * ============================================================
   */
  static async getNotifications(actor) {
    const notifications = [];

    const kycWhere = {};

    const txnWhere = {};

    if (actor.role !== "SUPER_ADMIN") {
      kycWhere.user = {
        parentId: actor.id,
      };

      txnWhere.userId = actor.id;
    }

    const [pendingKyc, pendingTxn] = await Promise.all([
      prisma.kyc.count({
        where: {
          ...kycWhere,
          status: "PENDING",
        },
      }),

      prisma.transaction.count({
        where: {
          ...txnWhere,
          status: "PENDING",
        },
      }),
    ]);

    if (pendingKyc > 0) {
      notifications.push({
        type: "KYC",
        severity: "warning",
        title: "Pending KYC",
        message: `${pendingKyc} KYC requests are pending.`,
      });
    }

    if (pendingTxn > 0) {
      notifications.push({
        type: "TRANSACTION",
        severity: "info",
        title: "Pending Transactions",
        message: `${pendingTxn} transactions are pending.`,
      });
    }

    return notifications;
  }

  /**
   * ============================================================
   * ANALYTICS
   * ============================================================
   */
  static async getAnalytics(actor) {
    const where = {
      initiatedAt: {
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      },
    };

    if (actor.role !== "SUPER_ADMIN") {
      where.userId = actor.id;
    }

    const transactions = await prisma.transaction.findMany({
      where,

      select: {
        initiatedAt: true,
        amount: true,
      },
    });

    const analytics = {};

    for (const txn of transactions) {
      const date = txn.initiatedAt.toISOString().split("T")[0];

      if (!analytics[date]) {
        analytics[date] = {
          transactions: 0,
          volume: 0,
        };
      }

      analytics[date].transactions++;
      analytics[date].volume += txn.amount;
    }

    return Object.entries(analytics)
      .sort(([a], [b]) => new Date(a) - new Date(b))
      .map(([date, value]) => ({
        date,
        transactions: value.transactions,
        volume: value.volume.toLocaleString(),
      }));
  }
}

export default DashboardService;
