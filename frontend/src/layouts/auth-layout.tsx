import React from 'react'

import logoIcon from "@/assets/logo.png"
import { Toaster } from '@/components/ui/sonner'

interface AuthLayoutProps {
    children: React.ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-[#f9fafb]">
            <div className="flex items-center gap-2 mb-8 select-none">
                <img src={logoIcon} width={132} />
            </div>

            <div className="w-full max-w-[480px] bg-white rounded-2xl border border-gray-100 p-8 md:p-10 shadow-sm">
                {children}
            </div>

            <Toaster />
        </div>
    )
}