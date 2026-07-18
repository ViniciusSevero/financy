import React, { useEffect, useState } from 'react'
import { AppLayout } from '../../../layouts/app-layout'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import {
    Search, Plus, ChevronLeft, ChevronRight
} from 'lucide-react'
import { TransactionData, TransactionModal } from '../components/transaction-modal'
import { useMutation, useQuery } from '@apollo/client/react'
import { Category, Transaction, TransactionResult } from '@/types'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/Category'
import { LIST_TRANSACTIONS } from '@/lib/graphql/queries/Transactions'
import { TransactionRow } from '../components/transaction-row'
import { getCategoryIcon } from '@/modules/shared/utils/utility-functions'
import { generateMonthPeriods } from '@/modules/shared/utils/date-periods'
import { CategoryColor } from '@/modules/categories/utils/categories.constants'
import { DELETE_TRANSACTION } from '@/lib/graphql/mutations/Transaction'
import { toast } from 'sonner'

export function Transactions() {
    const [search, setSearch] = useState('')
    const [type, setType] = useState('all')
    const [category, setCategory] = useState('all')
    const [period, setPeriod] = useState('all')
    const [currentPage, setCurrentPage] = useState(1)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [selectedTransaction, setSelectedTransaction] = useState<TransactionData | null>(null)

    const ITEMS_PER_PAGE = 5

    const categoriesResult = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
    const transactonsResult = useQuery<{ listTransactions: TransactionResult }>(LIST_TRANSACTIONS, {
        variables: {
            filters: {
                categoryId: category == 'all' ? undefined : category,
                transactionType: type == 'all' ? undefined : type,
                description: debouncedSearch == 'all' ? undefined : debouncedSearch,
                period: period == '' ? undefined : period
            },
            page: currentPage,
            limit: ITEMS_PER_PAGE
        },
        fetchPolicy: 'cache-and-network',
    })

    const transactions = transactonsResult.data?.listTransactions.data || []
    const totalItems = transactonsResult.data?.listTransactions.total || 0
    const categories = categoriesResult.data?.listCategories || []

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    const startItem = (currentPage - 1) * ITEMS_PER_PAGE + 1
    const endItem = Math.min(currentPage * ITEMS_PER_PAGE, totalItems)

    useEffect(() => {
        setCurrentPage(1)
    }, [debouncedSearch, type, category, period])

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedSearch(search)
        }, 500) // Aguarda o usuário parar de digitar por 500ms

        return () => clearTimeout(handler) // Limpa o timer se o usuário continuar digitando
    }, [search])

    const handleNewTransaction = () => {
        setSelectedTransaction(null)
        setIsModalOpen(true)
    }

    const handleEditTransaction = (transaction: Transaction) => {
        setSelectedTransaction({
            id: transaction.id,
            transactionType: transaction.transactionType,
            description: transaction.description,
            transactionDate: transaction.transactionDate,
            transactionValue: transaction.transactionValue,
            categoryId: transaction.categoryId,
        })
        setIsModalOpen(true)
    }

    const [deleteTransaction] = useMutation(DELETE_TRANSACTION, {
        onCompleted() {
            toast.success("Transação removida com sucesso")
        },
        onError() {
            toast.error("Falha ao remover a transação")
        },
    })

    const handleDeleteTransaction = async (id: string) => {
        await deleteTransaction({
            variables: {
                deleteTransactionId: id
            },
        })
        categoriesResult.refetch()
        transactonsResult.refetch()
    }

    return (
        <AppLayout>
            <div className="space-y-6">

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Transações</h1>
                        <p className="text-sm text-gray-500 mt-1">Gerencie todas as suas transações financeiras</p>
                    </div>
                    <Button
                        onClick={() => handleNewTransaction()}
                        className="bg-[#1b623b] hover:bg-[#154d2e] text-white gap-2 h-12 rounded-xl px-5 font-semibold transition-all shrink-0">
                        <Plus className="w-5 h-5" /> Nova transação
                    </Button>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Buscar</label>
                            <Input
                                placeholder="Buscar por descrição"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                icon={<Search className="w-5 h-5 text-gray-400" />}
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Tipo</label>
                            <select
                                value={type}
                                onChange={(e) => setType(e.target.value)}
                                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                            >
                                <option value="all">Todos</option>
                                <option value="income">Entradas</option>
                                <option value="outcome">Saídas</option>
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Categoria</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                            >
                                <option value="all">Todas</option>
                                {categories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.title}</option>
                                ))}
                            </select>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Período</label>
                            <select
                                value={period}
                                onChange={(e) => setPeriod(e.target.value)}
                                className="flex h-12 w-full rounded-xl border border-input bg-background px-4 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none cursor-pointer"
                                style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'></polyline></svg>")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center', backgroundSize: '16px' }}
                            >
                                <option value='all'>Selecione</option>
                                {generateMonthPeriods().map(yearMonth => (
                                    <option key={yearMonth.value} value={yearMonth.value}>{yearMonth.label}</option>
                                ))}
                            </select>
                        </div>

                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px] text-left border-collapse">
                            <thead>
                                <tr className="border-b border-gray-100">
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-[35%]">Descrição</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">Data</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">Categoria</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">Tipo</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-[15%]">Valor</th>
                                    <th className="p-6 text-xs font-bold text-gray-400 uppercase tracking-wider w-[10%] text-center">Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {transactions.map((tx) => (
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
                                        onEdit={() => handleEditTransaction(tx)}
                                        onDelete={() => handleDeleteTransaction(tx.id)}
                                    />
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* 3. Paginação Renderizada Dinamicamente */}
                    {totalPages > 1 && (
                        <div className="flex flex-col sm:flex-row items-center justify-between p-6 border-t border-gray-100 gap-4">
                            <span className="text-sm text-gray-500 font-medium">
                                {startItem} a {endItem} <span className="text-gray-300 mx-1">|</span> {totalItems} resultados
                            </span>

                            <div className="flex items-center gap-1.5">
                                <button
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                                >
                                    <ChevronLeft className="w-4 h-4" />
                                </button>

                                {Array.from({ length: totalPages }, (_, index) => {
                                    const pageNumber = index + 1;
                                    const isCurrent = pageNumber === currentPage;
                                    return (
                                        <button
                                            key={pageNumber}
                                            onClick={() => setCurrentPage(pageNumber)}
                                            className={`w-8 h-8 rounded-lg text-sm font-bold flex items-center justify-center transition-all border ${isCurrent
                                                ? "bg-[#1b623b] text-white border-transparent"
                                                : "text-gray-500 hover:bg-gray-50 border-gray-200"
                                                }`}
                                        >
                                            {pageNumber}
                                        </button>
                                    )
                                })}

                                <button
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    disabled={currentPage === totalPages}
                                    className="p-2 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                                >
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}

                </div>

            </div>

            <TransactionModal
                isOpen={isModalOpen}
                transcationToEdit={selectedTransaction}
                onClose={() => setIsModalOpen(false)}
                onSave={() => {
                    categoriesResult.refetch()
                    transactonsResult.refetch()
                }}
            />
        </AppLayout>
    )
}