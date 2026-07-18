import React from 'react'

import logoIcon from "@/assets/logo.png"
import { useAuthStore } from '@/stores/auth'
import { useLocation } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'

interface AppLayoutProps {
    children: React.ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
    const { user } = useAuthStore()
    const location = useLocation()
    const isDashboardPage = location.pathname === "/"
    const isTransactionsPage = location.pathname === "/transacoes"
    const isCategoriesPage = location.pathname === "/categorias"

    return (
        <div className="min-h-screen bg-[#f9fafb] font-sans text-foreground">
            <header className="h-20 bg-white border-b border-gray-100 flex items-center px-6 md:px-12 justify-between sticky top-0 z-10">

                <div className="flex items-center gap-12">
                    <div className="flex items-center gap-2 select-none cursor-pointer">
                        <img src={logoIcon} />
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
                        <a href="/"
                            className={isDashboardPage ? "text-[#1b623b] font-bold" : "text-gray-500 hover:text-gray-900 transition-colors"}
                        >Dashboard</a>
                        <a href="/transacoes"
                            className={isTransactionsPage ? "text-[#1b623b] font-bold" : "text-gray-500 hover:text-gray-900 transition-colors"}
                        >Transações</a>
                        <a href="/categorias"
                            className={isCategoriesPage ? "text-[#1b623b] font-bold" : "text-gray-500 hover:text-gray-900 transition-colors"}
                        >Categorias</a>
                    </nav>
                </div>

                <div className="flex items-center gap-4">
                    <a href="/perfil">
                        <button className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-bold text-sm hover:bg-gray-300 transition-colors">
                            {user?.name?.charAt(0)}
                        </button>
                    </a>
                </div>
            </header>

            <main className="max-w-[1200px] mx-auto p-6 md:p-8">
                {children}
            </main>

            <Toaster />
        </div>
    )
}