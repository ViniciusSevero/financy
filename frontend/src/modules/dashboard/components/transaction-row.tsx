import { CATEGORY_COLOR_MAP, CategoryColor } from "@/modules/categories/utils/categories.constants"
import { formatCurrency } from "@/modules/shared/utils/utility-functions"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"

interface TransactionRowProps {
    id: string
    transactionType: string
    description: string
    transactionDate: string
    transactionValue: number
    categoryTitle: string
    color: CategoryColor
    icon: React.ComponentType<{ className?: string }>
}

export function TransactionRow({ id, transactionType, description, transactionDate, transactionValue, categoryTitle, color, icon: Icon }: TransactionRowProps) {

    const colorMap = CATEGORY_COLOR_MAP[color] || CATEGORY_COLOR_MAP.blue

    return (
        <div key={id} className="flex items-center justify-between p-5 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap.icon}}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h4 className="font-semibold text-gray-900 text-base">{description}</h4>
                    <p className="text-sm text-gray-500">{transactionDate}</p>
                </div>
            </div>

            <div className="flex items-center gap-8 w-[40%] justify-between">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${colorMap.pill}`}>
                    {categoryTitle}
                </span>
                <div className="flex items-center gap-2 text-sm font-bold whitespace-nowrap">
                    {transactionType === 'income' ? '+ ' : '- '}
                    {formatCurrency(transactionValue)}
                    {transactionType === 'income'
                        ? <ArrowUpRight className="w-4 h-4 text-green-600" />
                        : <ArrowDownRight className="w-4 h-4 text-red-500" />
                    }
                </div>
            </div>
        </div>
    )
}