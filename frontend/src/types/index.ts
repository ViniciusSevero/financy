export interface User {
    id: string
    name: string
    email: string
    createdAt?: string
    updatedAt?: string
}


export interface RegisterInput {
    name: string
    email: string
    password: string
}


export interface LoginInput {
    email: string
    password: string
}

export interface Category {
    id: string
    title: string
    description: string
    icon: string
    color: string
    transactionsCount: number
    transactionsTotal: number
    createdAt: string
    updatedAt?: string
}

export interface DashboardStats {
    monthlyBalance: number
    monthlyIncome: number
    monthlyOutcome: number
    totalCategories: number
    totalTransactions: number
    mostUsedCategory: {
        title: string
        count: number
        color: string
        icon: string
    }
}

export interface Transaction {
    id: string
    transactionType: string
    description: string
    transactionDate: string
    transactionValue: number
    userId: string
    categoryId: string
    category: {
        id: string
        title: string
        description: string
        icon: string
        color: string
    }
    createdAt: Date
    updatedAt: Date
}

export interface TransactionResult {
    data: Transaction[]
    total: number
}