import { CATEGORY_COLOR_MAP, CategoryColor } from "@/modules/categories/utils/categories.constants"
import { formatCurrency } from "@/modules/shared/utils/utility-functions"
import { ArrowDownCircle, ArrowUpCircle, Edit2, Trash2 } from "lucide-react"

interface TransactionRowProps {
    id: string
    transactionType: string
    description: string
    transactionDate: string
    transactionValue: number
    categoryTitle: string
    color: CategoryColor
    icon: React.ComponentType<{ className?: string }>
    onEdit: () => void
    onDelete: () => void
}

export function TransactionRow({ id, transactionType, description, transactionDate, transactionValue, categoryTitle, color, icon: Icon, onEdit, onDelete }: TransactionRowProps) {
    const colorMap = CATEGORY_COLOR_MAP[color] || CATEGORY_COLOR_MAP.blue
    return (
        <tr key={id} className="border-b border-gray-50 last:border-b-0 hover:bg-gray-50/50 transition-colors">
            <td className="p-5">
                <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap.icon}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <span className="font-semibold text-gray-900 text-base">{description}</span>
                </div>
            </td>

            <td className="p-5 text-sm text-gray-500 font-medium">{transactionDate}</td>

            <td className="p-5">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap.pill}`}>
                    {categoryTitle}
                </span>
            </td>

            <td className="p-5">
                <div className="flex items-center gap-1.5 text-sm font-semibold">
                    {transactionType === 'income' ? (
                        <>
                            <ArrowUpCircle className="w-4 h-4 text-green-600" />
                            <span className="text-green-600">Entrada</span>
                        </>
                    ) : (
                        <>
                            <ArrowDownCircle className="w-4 h-4 text-red-500" />
                            <span className="text-red-500">Saída</span>
                        </>
                    )}
                </div>
            </td>

            {/* Valor */}
            <td className="p-5 font-bold text-gray-900">
                <span className={transactionType === 'income' ? 'text-gray-900' : 'text-gray-900'}>
                    {transactionType === 'income' ? '+ ' : '- '}
                    {formatCurrency(transactionValue)}
                </span>
            </td>

            {/* Ações */}
            <td className="p-5">
                <div className="flex items-center justify-center gap-2">
                    <button
                        className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                        onClick={() => onDelete()}>
                        <Trash2 className="w-4 h-4" />
                    </button>
                    <button
                        className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                        onClick={() => onEdit()}>
                        <Edit2 className="w-4 h-4" />
                    </button>
                </div>
            </td>
        </tr>
    )
}