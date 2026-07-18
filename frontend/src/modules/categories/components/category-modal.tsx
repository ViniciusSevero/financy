import React, { useEffect, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "../../../components/ui/dialog"
import { Button } from "../../../components/ui/button"
import { AVAILABLE_COLORS, AVAILABLE_ICONS } from '../utils/categories.constants'
import { CREATE_CATEGORY, UPDATE_CATEGORY } from '@/lib/graphql/mutations/Category'
import { useMutation } from '@apollo/client/react'
import { toast } from 'sonner'

export interface CategoryData {
    id: string
    title: string
    description: string
    icon: string
    color: string
}

interface CategoryModalProps {
    isOpen: boolean
    categoryToEdit: CategoryData | null
    onClose: () => void
    onSave: () => void
}

export function CategoryModal({ isOpen, onClose, onSave, categoryToEdit }: CategoryModalProps) {
    const [title, setTitle] = useState('')
    const [description, setDescription] = useState('')
    const [selectedIcon, setSelectedIcon] = useState('briefcase')
    const [selectedColor, setSelectedColor] = useState('green')

    const [createCategory] = useMutation(CREATE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria criada com sucesso")
            clearFields()
            onSave?.()
        },
        onError() {
            toast.error("Falha ao criar a categoria")
        },
    })

    const [updateCategory] = useMutation(UPDATE_CATEGORY, {
        onCompleted() {
            toast.success("Categoria atualizada com sucesso")
            clearFields()
            onSave?.()
        },
        onError() {
            toast.error("Falha ao atualizar a categoria")
        },
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (!categoryToEdit) {
            createCategory({
                variables: {
                    data: {
                        title,
                        description,
                        color: selectedColor,
                        icon: selectedIcon
                    },
                },
            })
        } else {
            updateCategory({
                variables: {
                    data: {
                        title,
                        description,
                        color: selectedColor,
                        icon: selectedIcon
                    },
                    updateCategoryId: categoryToEdit.id
                },
            })
        }
        onClose()
    }

    const clearFields = () => {
        setTitle('')
        setDescription('')
        setSelectedIcon('briefcase')
        setSelectedColor('green')
    }

    useEffect(() => {
        if (categoryToEdit) {
            setTitle(categoryToEdit.title)
            setDescription(categoryToEdit.description)
            setSelectedIcon(categoryToEdit.icon)
            setSelectedColor(categoryToEdit.color)
        } else {
            clearFields()
        }
    }, [categoryToEdit, isOpen])

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="sm:max-w-[480px] p-6 md:p-8 rounded-3xl border border-gray-100 bg-white gap-0">

                <DialogHeader className="flex flex-row items-start justify-between pb-6">
                    <div>
                        <DialogTitle className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">
                            Nova categoria
                        </DialogTitle>
                        <DialogDescription className="text-sm text-gray-500 mt-1">
                            Organize suas transações com categorias
                        </DialogDescription>
                    </div>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-5">

                    <div className="space-y-1.5">
                        <label htmlFor="title" className="text-sm font-semibold text-gray-700">
                            Título
                        </label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex. Alimentação"
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b623b]/20 focus:border-[#1b623b] transition-all"
                            required
                        />
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
                            placeholder="Descrição da categoria"
                            className="w-full h-12 px-4 bg-white border border-gray-200 rounded-xl text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b623b]/20 focus:border-[#1b623b] transition-all"
                        />
                        <span className="text-xs text-gray-400 block pt-0.5">
                            Opcional
                        </span>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block">
                            Ícone
                        </label>
                        <div className="grid grid-cols-8 gap-2">
                            {AVAILABLE_ICONS.map((item) => {
                                const IconComponent = item.icon
                                const isSelected = selectedIcon === item.id
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => setSelectedIcon(item.id)}
                                        className={`aspect-square rounded-xl flex items-center justify-center border transition-all ${isSelected
                                            ? 'border-[#1b623b] bg-[#1b623b]/5 text-[#1b623b] ring-2 ring-[#1b623b]/10'
                                            : 'border-gray-200 hover:bg-gray-50 text-gray-500 hover:text-gray-900'
                                            }`}
                                    >
                                        <IconComponent className="w-5 h-5" />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 block">
                            Cor
                        </label>
                        <div className="flex flex-wrap gap-2.5">
                            {AVAILABLE_COLORS.map((color) => {
                                const isSelected = selectedColor === color.id
                                return (
                                    <button
                                        key={color.id}
                                        type="button"
                                        onClick={() => setSelectedColor(color.id)}
                                        className={`w-12 h-8 rounded-lg flex items-center justify-center border transition-all p-0.5 ${isSelected
                                            ? 'border-[#1b623b] ring-2 ring-[#1b623b]/15'
                                            : 'border-transparent hover:scale-105'
                                            }`}
                                    >
                                        <div className={`w-full h-full rounded-md ${color.bgClass}`} />
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="pt-3">
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