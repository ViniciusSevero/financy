import React, { useState } from 'react'
import { AppLayout } from '../../../layouts/app-layout'
import {
    Wallet, ArrowUpCircle, ArrowDownCircle,
    Briefcase, Utensils, Car, ShoppingCart, PiggyBank, Plus, ChevronRight, ArrowUpRight, ArrowDownRight, Circle
} from 'lucide-react'
import { Button } from '../../../components/ui/button'
import { TransactionModal } from '@/modules/transactions/components/transaction-modal'
import { useQuery } from '@apollo/client/react'
import { Category, DashboardStats, Transaction } from '@/types'
import { GET_DASHBOARD_STATS } from '@/lib/graphql/queries/Dashboard'
import { LIST_TRANSACTIONS } from '@/lib/graphql/queries/Transactions'
import { TransactionRow } from '../components/transaction-row'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/Category'
import { formatCurrency, getCategoryIcon } from '@/modules/shared/utils/utility-functions'
import { CATEGORY_COLOR_MAP, CategoryColor } from '@/modules/categories/utils/categories.constants'


export function Dashboard() {

    const [isModalOpen, setIsModalOpen] = useState(false)

    const dashboardResult = useQuery<{ getDashboardStats: DashboardStats }>(GET_DASHBOARD_STATS)
    const categoriesResult = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
    const transactonsResult = useQuery<{ listTransactions: Transaction[] }>(LIST_TRANSACTIONS, {
        variables: {
            limit: 5
        },
        fetchPolicy: 'cache-and-network',
    })

    const dashboardStats = dashboardResult.data?.getDashboardStats
    const recentTransactions = transactonsResult.data?.listTransactions || []
    const categories = categoriesResult.data?.listCategories || []

    const getPillCategoryColor = (color: CategoryColor) => {
        const colorMap = CATEGORY_COLOR_MAP[color] || CATEGORY_COLOR_MAP.blue
        return colorMap.pill
    }

    return (
        <AppLayout>
            <div className="space-y-6">

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            <Wallet className="w-5 h-5 text-indigo-500" />
                            Saldo Total
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardStats?.monthlyBalance)}</div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            <ArrowUpCircle className="w-5 h-5 text-green-600" />
                            Receitas do Mês
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardStats?.monthlyIncome)}</div>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                        <div className="flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-wide mb-4">
                            <ArrowDownCircle className="w-5 h-5 text-red-500" />
                            Despesas do Mês
                        </div>
                        <div className="text-3xl font-bold text-gray-900">{formatCurrency(dashboardStats?.monthlyOutcome)}</div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                    <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Transações Recentes</h3>
                            <a href="/transacoes" className="text-sm font-semibold text-[#1b623b] flex items-center gap-1 hover:underline">
                                Ver todas <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="flex flex-col">
                            {recentTransactions.map((tx) => (
                                <TransactionRow
                                    key={tx.id}
                                    id={tx.id}
                                    description={tx.description}
                                    categoryTitle={tx.category.title}
                                    transactionType={tx.transactionType}
                                    transactionDate={tx.transactionDate}
                                    transactionValue={tx.transactionValue}
                                    color={tx.category.color as CategoryColor}
                                    icon={getCategoryIcon(tx.category.icon)}
                                />
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100">
                            <Button
                                onClick={() => setIsModalOpen(true)}
                                variant="ghost" className="w-full text-[#1b623b] hover:text-[#1b623b] hover:bg-green-50 font-semibold gap-2 h-12 rounded-xl">
                                <Plus className="w-5 h-5" /> Nova transação
                            </Button>
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-100">
                            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Categorias</h3>
                            <a href="/categorias" className="text-sm font-semibold text-[#1b623b] flex items-center gap-1 hover:underline">
                                Gerenciar <ChevronRight className="w-4 h-4" />
                            </a>
                        </div>

                        <div className="flex flex-col p-2">
                            {categories.map((cat) => (
                                <div key={cat.id} className="flex items-center justify-between p-4 hover:bg-gray-50/50 rounded-xl transition-colors">
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPillCategoryColor(cat.color as CategoryColor)}`}>
                                        {cat.title}
                                    </span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500">{cat.transactionsCount} itens</span>
                                        <span className="text-sm font-bold text-gray-900 w-[80px] text-right">
                                            {formatCurrency(cat.transactionsTotal)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            <TransactionModal
                isOpen={isModalOpen}
                transcationToEdit={null}
                onClose={() => setIsModalOpen(false)}
                onSave={() => {
                    dashboardResult.refetch()
                    transactonsResult.refetch()
                }}
            />
        </AppLayout>
    )
}