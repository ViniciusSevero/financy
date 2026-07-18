import { Prisma } from '../../prisma/generated/client'
import { TransactionType } from '../../prisma/generated/enums'
import { prismaClient } from '../../prisma/prisma'
import { CreateTransactionInput, TransactionFiltersInput, UpdateTransactionInput } from '../dtos/input/transaction.input'

export class TransactionService {
    async createTransaction(data: CreateTransactionInput, userId: string) {
        return prismaClient.transaction.create({
            data: {
                transactionType: data.transactionType as unknown as TransactionType,
                description: data.description,
                transactionDate: data.transactionDate,
                transactionValue: data.transactionValue,
                categoryId: data.categoryId,
                userId,
            },
        })
    }

    async updateTransaction(id: string, data: UpdateTransactionInput, userId: string) {
        console.log('id', id)
        console.log('userId', userId)
        const transaction = await prismaClient.transaction.findUnique({
            where: {
                id,
                userId
            },
        })

        if (!transaction) throw new Error('Transação não encontrada')

        return prismaClient.transaction.update({
            where: {
                id: id
            },
            data: {
                transactionType: data.transactionType as unknown as TransactionType,
                description: data.description,
                transactionDate: data.transactionDate,
                transactionValue: data.transactionValue,
                categoryId: data.categoryId,
            },
        })
    }

    async listTransactions(userId: string, filters?: TransactionFiltersInput, limit?: number) {

        const whereClause: Prisma.TransactionWhereInput = {
            userId,
        };

        if (filters) {
            if (filters.description) {
                whereClause.description = {
                    contains: filters.description,
                };
            }

            if (filters.transactionType) {
                whereClause.transactionType = filters.transactionType;
            }

            if (filters.categoryId) {
                whereClause.categoryId = filters.categoryId;
            }

            if (filters.period) {
                const [monthStr, yearStr] = filters.period.split("-");
                const month = parseInt(monthStr, 10) - 1;
                const year = parseInt(yearStr, 10);

                if (!isNaN(month) && !isNaN(year)) {
                    const startOfPeriod = new Date(Date.UTC(year, month, 1));
                    const endOfPeriod = new Date(Date.UTC(year, month + 1, 0, 23, 59, 59, 999));

                    whereClause.transactionDate = {
                        gte: startOfPeriod,
                        lte: endOfPeriod,
                    };
                }
            }
        }

        return await prismaClient.transaction.findMany({
            where: whereClause,
            orderBy: {
                transactionDate: "desc",
            },
            ...(limit && { take: limit })
        });
    }


    async findTransactionById(id: string, userId: string) {
        return prismaClient.transaction.findUnique({
            where: {
                id,
                userId
            }
        })
    }

    async getTransaction(id: string, userId: string) {
        const transaction = await prismaClient.transaction.findUnique({
            where: {
                id,
                userId
            },
        })


        if (!transaction) throw new Error('Transação não encontrada')

        console.log('id', id)
        console.log('userId', userId)
        console.log('transaction.id', transaction.id)
        console.log('transaction.userId', transaction.userId)

        return transaction
    }

    async deleteTransaction(id: string, userId: string) {
        const findIdea = await prismaClient.transaction.findUnique({
            where: {
                id,
                userId
            },
        })
        if (!findIdea) throw new Error('Transação não encontrada')
        return prismaClient.transaction.delete({
            where: {
                id,
                userId
            },
        })
    }

    async getMontlyTransactions(startOfMonth: Date, endOfMonth: Date, userId: string) {
        return await prismaClient.transaction.findMany({
            where: {
                userId,
                transactionDate: {
                    gte: startOfMonth,
                    lte: endOfMonth
                }
            },
            select: { transactionType: true, transactionValue: true }
        })
    }

    async countByCategory(categoryId: string, userId: string) {
        return prismaClient.transaction.count({
            where: {
                categoryId: categoryId,
                userId: userId
            },
        })
    }

    async sumValueByCategory(categoryId: string, userId: string) {
        const balanceGroups = await prismaClient.transaction.groupBy({
            by: ["transactionType"],
            where: {
                categoryId: categoryId,
                userId,
            },
            _sum: {
                transactionValue: true,
            },
        });
        let totalBalance = 0;

        balanceGroups.forEach((group) => {
            const sumValue = group._sum.transactionValue || 0;

            if (group.transactionType === "income") {
                totalBalance += sumValue;
            } else if (group.transactionType === "outcome") {
                totalBalance -= sumValue;
            }
        });

        return Math.round(totalBalance * 100) / 100;
    }
}