import {
    Briefcase, Car, Heart, PiggyBank, ShoppingCart, Ticket,
    Gift, Utensils, PawPrint, Home, Dumbbell, BookOpen,
    ShoppingBag, Landmark, FileText
} from 'lucide-react'

export const AVAILABLE_ICONS = [
    { id: 'briefcase', icon: Briefcase },
    { id: 'car', icon: Car },
    { id: 'heart', icon: Heart },
    { id: 'piggy', icon: PiggyBank },
    { id: 'cart', icon: ShoppingCart },
    { id: 'ticket', icon: Ticket },
    { id: 'gift', icon: Gift },
    { id: 'utensils', icon: Utensils },
    { id: 'paw', icon: PawPrint },
    { id: 'home', icon: Home },
    { id: 'dumbbell', icon: Dumbbell },
    { id: 'book', icon: BookOpen },
    { id: 'bag', icon: ShoppingBag },
    { id: 'landmark', icon: Landmark },
    { id: 'file', icon: FileText },
]

export const AVAILABLE_COLORS = [
    { id: 'green', hex: '#10b981', bgClass: 'bg-[#10b981]' },
    { id: 'blue', hex: '#3b82f6', bgClass: 'bg-[#3b82f6]' },
    { id: 'purple', hex: '#a855f7', bgClass: 'bg-[#a855f7]' },
    { id: 'pink', hex: '#db2777', bgClass: 'bg-[#db2777]' },
    { id: 'red', hex: '#ef4444', bgClass: 'bg-[#ef4444]' },
    { id: 'orange', hex: '#f97316', bgClass: 'bg-[#f97316]' },
    { id: 'yellow', hex: '#d97706', bgClass: 'bg-[#d97706]' },
]

export const CATEGORY_COLOR_MAP = {
    blue: {
        icon: "text-blue-600 bg-blue-50",
        pill: "bg-blue-50 text-blue-700",
    },
    pink: {
        icon: "text-pink-600 bg-pink-50",
        pill: "bg-pink-50 text-pink-700",
    },
    emerald: {
        icon: "text-emerald-600 bg-emerald-50",
        pill: "bg-emerald-50 text-emerald-700",
    },
    orange: {
        icon: "text-orange-600 bg-orange-50",
        pill: "bg-orange-50 text-orange-700",
    },
    green: {
        icon: "text-green-600 bg-green-50",
        pill: "bg-green-50 text-green-700",
    },
    red: {
        icon: "text-red-600 bg-red-50",
        pill: "bg-red-50 text-red-600",
    },
    purple: {
        icon: "text-purple-600 bg-purple-50",
        pill: "bg-purple-50 text-purple-700",
    },
    yellow: {
        icon: "text-yellow-600 bg-yellow-50",
        pill: "bg-yellow-50 text-yellow-700",
    },
} as const;

export type CategoryColor = keyof typeof CATEGORY_COLOR_MAP;