import { Edit2, Trash2 } from "lucide-react"
import { CATEGORY_COLOR_MAP, CategoryColor } from "../utils/categories.constants"

interface CategoryCardProps {
    title: string
    description: string
    itemsCount: number
    icon: React.ComponentType<{ className?: string }>
    color: CategoryColor
    onSelect: () => void
    onRemove: () => void
}

export function CategoryCard({ title, description, itemsCount, icon: Icon, color, onSelect, onRemove }: CategoryCardProps) {
    const colorMap = CATEGORY_COLOR_MAP[color] || CATEGORY_COLOR_MAP.blue
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md/50 transition-all group">
            <div>
                <div className="flex items-center justify-between gap-4 mb-5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colorMap.icon}`}>
                        <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex items-center gap-1.5 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                        <button
                            className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                            onClick={() => onRemove()}>
                            <Trash2 className="w-4 h-4" />
                        </button>
                        <button
                            className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                            onClick={() => onSelect()}>
                            <Edit2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                <h3 className="font-bold text-gray-900 text-lg leading-tight">{title}</h3>
                <p className="text-sm text-gray-500 mt-1.5 leading-relaxed min-h-[40px] line-clamp-2">
                    {description}
                </p>
            </div>

            <div className="flex items-center justify-between gap-2 mt-6 pt-4 border-t border-gray-50">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${colorMap.pill}`}>
                    {title}
                </span>
                <span className="text-sm text-gray-400 font-medium">
                    {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
                </span>
            </div>
        </div>
    )
}