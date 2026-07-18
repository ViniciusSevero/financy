import { Circle } from "lucide-react"
import { AVAILABLE_ICONS } from "../../categories/utils/categories.constants"

export const formatCurrency = (value: number | undefined) => {
    if (!value) return 'R$ 0,00'
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
}

export const getCategoryIcon = (icon: string) => {
    const avaiableIcon = AVAILABLE_ICONS.filter(i => i.id == icon)[0]
    return !avaiableIcon ? Circle : avaiableIcon.icon
}