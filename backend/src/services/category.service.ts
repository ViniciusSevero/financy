import { StringNullableFilter } from '../../prisma/generated/commonInputTypes'
import { prismaClient } from '../../prisma/prisma'
import { CreateCategoryInput, UpdateCategoryInput } from '../dtos/input/category.input'

export class CategoryService {
    async createCategory(data: CreateCategoryInput, userId: string) {
        return prismaClient.category.create({
            data: {
                title: data.title,
                description: data.description,
                icon: data.icon,
                color: data.color,
                userId,
            },
        })
    }

    async updateCategory(id: string, data: UpdateCategoryInput, userId: string) {
        const idea = prismaClient.category.findUnique({
            where: {
                id: id,
                userId: userId
            }
        })

        if (!idea) throw new Error('Categoria não encontrada')

        return prismaClient.category.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                icon: data.icon,
                color: data.color,
            },
        })
    }

    async listCategories(userId: string) {
        return prismaClient.category.findMany({
            where: {
                userId
            }
        })
    }

    async findCategoryById(id: string, userId?: string) {
        if (userId) {
            return prismaClient.category.findUnique({
                where: {
                    id,
                    userId
                }
            })
        }
        return prismaClient.category.findUnique({
            where: { id }
        })
    }

    async getCategory(id: string, userId: string) {
        const idea = await prismaClient.category.findUnique({
            where: {
                id,
                userId
            },
        })

        if (!idea) throw new Error('Categoria não encontrada')

        return idea
    }

    async deleteCategory(id: string, userId: string) {
        const findIdea = await prismaClient.category.findUnique({
            where: {
                id,
                userId
            },
        })
        if (!findIdea) throw new Error('Categoria não encontrada')
        return prismaClient.category.delete({
            where: {
                id,
            },
        })
    }

    async countCategories(userId: string) {
        return await prismaClient.category.count({
            where: { userId }
        })
    }

    async getMostUsedCategory(userId: string) {
        return await prismaClient.transaction.groupBy({
            by: ['categoryId'],
            where: { userId },
            _count: {
                categoryId: true
            },
            orderBy: {
                _count: {
                    categoryId: 'desc'
                }
            },
            take: 1
        })
    }
}