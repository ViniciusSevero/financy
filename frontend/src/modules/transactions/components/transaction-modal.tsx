import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogClose,
} from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { ArrowDownCircle, ArrowUpCircle, X } from 'lucide-react'
import { toast } from 'sonner'
import { useMutation, useQuery } from '@apollo/client/react'
import { CREATE_TRANSACTION, UPDATE_TRANSACTION } from '@/lib/graphql/mutations/Transaction'
import { Category } from '@/types'
import { LIST_CATEGORIES } from '@/lib/graphql/queries/Category'


export interface TransactionData {
    id: string
    transactionType: string
    description: string
    transactionDate: string
    transactionValue: number
    categoryId: string
}

interface TransactionModalProps {
    isOpen: boolean
    transcationToEdit: TransactionData | null
    onClose: () => void
    onSave: () => void
}

export function TransactionModal({ isOpen, onClose, onSave, transcationToEdit }: TransactionModalProps) {
    const [type, setType] = useState<'outcome' | 'income'>('outcome')
    const [description, setDescription] = useState('')
    const [date, setDate] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('')

    const categoriesResult = useQuery<{ listCategories: Category[] }>(LIST_CATEGORIES)
    const categories = categoriesResult.data?.listCategories || []

    const [createTransaction] = useMutation(CREATE_TRANSACTION, {
        onCompleted() {
            toast.success("Transação criada com sucesso")
            clearFields()
            onSave?.()
        },
        onError() {
            toast.error("Falha ao criar a transação")
        },
    })

    const [updateTransaction] = useMutation(UPDATE_TRANSACTION, {
        onCompleted() {
            toast.success("Transação alterada com sucesso")
            clearFields()
            onSave?.()
        },
        onError() {
            toast.error("Falha ao alterar a transação")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!transcationToEdit) {
            createTransaction({
                variables: {
                    data: {
                        transactionType: type,
                        description: description,
                        transactionDate: date,
                        transactionValue: Number(amount),
                        categoryId: category
                    },
                },
            })
        } else {
            updateTransaction({
                variables: {
                    data: {
                        transactionType: type,
                        description: description,
                        transactionDate: date,
                        transactionValue: Number(amount),
                        categoryId: category
                    },
                    updateTransactionId: transcationToEdit.id
                },
            })
        }
        onClose()
    }

    const clearFields = () => {
        setType('outcome')
        setDescription('')
        setDate('')
        setAmount('')
        setCategory('')
    }

    useEffect(() => {
        if (transcationToEdit) {
            setType(transcationToEdit.transactionType == 'outcome' ? 'outcome' : 'income')
            setDescription(transcationToEdit.description)
            setDate(transcationToEdit.transactionDate)
            setAmount(String(transcationToEdit.transactionValue))
            setCategory(transcationToEdit.categoryId)
        } else {
            clearFields()
        }
    }, [transcationToEdit, isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] p-6 md:p-8 rounded-3xl border border-gray-100 bg-white gap-0">

                <DialogHeader className="flex flex-row items-start justify-between pb-6">
                    <div>
                        <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                            Nova transação
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mt-1">
                            Registre sua despesa ou receita
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="grid grid-cols-2 gap-3 p-1.5 bg-white border border-gray-100 rounded-2xl">
                        <button
                            type="button"
                            onClick={() => setType('outcome')}
                            className={`flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-all border ${type === 'outcome'
                                ? 'border-red-500 bg-red-50/10 text-red-600'
                                : 'border-transparent text-gray-400 hover:text-gray-500'
                                }`}
                        >
                            <ArrowDownCircle className={`w-5 h-5 ${type === 'outcome' ? 'text-red-500' : 'text-gray-400'}`} />
                            <span>Despesa</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setType('income')}
                            className={`flex items-center justify-center gap-2 h-12 rounded-xl font-semibold text-sm transition-all border ${type === 'income'
                                ? 'border-emerald-500 bg-emerald-50/10 text-emerald-600'
                                : 'border-transparent text-gray-400 hover:text-gray-500'
                                }`}
                        >
                            <ArrowUpCircle className={`w-5 h-5 ${type === 'income' ? 'text-emerald-500' : 'text-gray-400'}`} />
                            <span>Receita</span>
                        </button>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="description" className="text-sm font-semibold text-gray-700">
                            Descrição
                        </label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Ex. Almoço no restaurante"
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b623b]/20 focus:border-[#1b623b] transition-all"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label htmlFor="date" className="text-sm font-semibold text-gray-700">
                                Data
                            </label>
                            <input
                                type="date"
                                id="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b623b]/20 focus:border-[#1b623b] transition-all cursor-pointer"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="amount" className="text-sm font-semibold text-gray-700">
                                Valor
                            </label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-sm font-semibold text-gray-950">
                                    R$
                                </span>
                                <input
                                    type="text"
                                    id="amount"
                                    value={amount}
                                    onChange={(e) => setAmount(e.target.value)}
                                    placeholder="0,00"
                                    className="w-full h-12 pl-10 pr-4 bg-white border border-gray-200 rounded-xl text-gray-950 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1b623b]/20 focus:border-[#1b623b] transition-all"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label htmlFor="category" className="text-sm font-semibold text-gray-700">
                            Categoria
                        </label>
                        <select
                            id="category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-500 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#1b623b]/20 focus:border-[#1b623b] transition-all appearance-none cursor-pointer"
                            required
                        >
                            <option value="" disabled>Selecione</option>
                            {categories.map((category) => (
                                <option key={category.id} id={category.id} value={category.id}>{category.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-12 bg-[#1b623b] hover:bg-[#154d2e] text-white rounded-xl font-semibold text-sm transition-all shadow-sm"
                        >
                            Salvar
                        </Button>
                    </div>

                </form>
            </DialogContent>
        </Dialog>
    )
}