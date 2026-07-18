import React, { useState } from 'react'
import { AppLayout } from '../../../layouts/app-layout'
import { Button } from '../../../components/ui/button'
import {
    Plus, ArrowUpDown, Utensils, Circle, Tag
} from 'lucide-react'
import { CategoryData, CategoryModal } from '../components/category-modal'
import { SummaryCard } from '../components/summary-card'
import { CategoryCard } from '../components/category-card'
import { useMutation, useQuery } from '@apollo/client/react'
import { Category, DashboardStats } from '@/types'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/Category'
import { AVAILABLE_ICONS, CATEGORY_COLOR_MAP, CategoryColor } from '../utils/categories.constants'
import { GET_DASHBOARD_STATS } from '@/lib/graphql/queries/Dashboard'
import { DELETE_CATEGORY } from '@/lib/graphql/mutations/Category'
import { toast } from 'sonner'
import { getCategoryIcon } from '@/modules/shared/utils/utility-functions'


export function Categories() {

    const [isModalOpen, setIsModalOpen] = useState(false)
    const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null)

    const categoriesResult = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
    const dashboardResult = useQuery<{ getDashboardStats: DashboardStats }>(GET_DASHBOARD_STATS)

    const categories = categoriesResult.data?.listCategories || []
    const dashboardStats = dashboardResult.data?.getDashboardStats

    const [deleteCategory] = useMutation(DELETE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria removida com sucesso")
        },
        onError() {
            toast.error("Falha ao remover a categoria")
        },
    })

    const handleCreateNew = () => {
        setSelectedCategory(null)
        setIsModalOpen(true)
    }

    const handleEditCategory = (category: Category) => {
        setSelectedCategory({
            id: category.id,
            title: category.title,
            description: category.description,
            color: category.color,
            icon: category.icon
        })
        setIsModalOpen(true)
    }

    const handleDeleteCategory = async (id: string) => {
        await deleteCategory({
            variables: {
                deleteCategoryId: id
            },
        })
        categoriesResult.refetch()
        dashboardResult.refetch()
    }

    return (
        <AppLayout>
            <div className="space-y-6">

                <div className="flex items-center justify-between gap-4 w-full pb-2">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
                            Categorias
                        </h1>
                        <p className="text-xs md:text-sm text-gray-500 mt-1">
                            Organize suas transações por categorias
                        </p>
                    </div>

                    <Button
                        onClick={handleCreateNew}
                        className="bg-[#1b623b] hover:bg-[#154d2e] text-white gap-2 h-11 md:h-12 rounded-xl px-5 font-semibold transition-all shrink-0 text-sm shadow-sm">
                        <Plus className="w-4 h-4 md:w-5 md:h-5" />
                        <span>Nova categoria</span>
                    </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <SummaryCard
                        icon={Tag}
                        value={categories.length || ''}
                        label="Total de categorias"
                        iconColor={"text-gray-600 bg-gray-50"}
                    />
                    <SummaryCard
                        icon={ArrowUpDown}
                        value={dashboardStats?.totalTransactions || ''}
                        label="Total de transações"
                        iconColor={"text-purple-600 bg-purple-50"}
                    />
                    <SummaryCard
                        icon={getCategoryIcon(dashboardStats?.mostUsedCategory.icon || '')}
                        value={dashboardStats?.mostUsedCategory.title || ''}
                        label="Categoria mais utilizada"
                        iconColor={dashboardStats?.mostUsedCategory.color || 'blue'}
                    />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {!categoriesResult.loading && categories.map((category) => (
                        <CategoryCard
                            key={category.id}
                            title={category.title}
                            description={category.description}
                            itemsCount={category.transactionsCount}
                            icon={getCategoryIcon(category.icon)}
                            color={category.color as CategoryColor}
                            onSelect={() => handleEditCategory(category)}
                            onRemove={() => handleDeleteCategory(category.id)}
                        />
                    ))}
                </div>

            </div>

            <CategoryModal
                isOpen={isModalOpen}
                categoryToEdit={selectedCategory}
                onClose={() => setIsModalOpen(false)}
                onSave={() => {
                    categoriesResult.refetch()
                    dashboardResult.refetch()
                }}
            />
        </AppLayout>
    )
}