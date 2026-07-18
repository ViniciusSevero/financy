import React, { useEffect, useState } from 'react'
import { AppLayout } from '../../../layouts/app-layout'
import { Button } from '../../../components/ui/button'
import { User, Mail, LogOut } from 'lucide-react'
import { useAuthStore } from '@/stores/auth'
import { useNavigate } from 'react-router-dom'
import { useMutation } from '@apollo/client/react'
import { UPDATE_USER } from '@/lib/graphql/mutations/UpdateUser'

export function Profile() {
    const { user, logout, updateUser } = useAuthStore()
    const navigate = useNavigate()
    const [name, setName] = useState('')

    useEffect(() => {
        if (user?.name) {
            setName(user.name)
        }
    }, [user])

    type UpdateUserMutationData = { updateUser: typeof User }
    type UpdateUserVariables = {
        updateUserId: string
        data: { name?: string }
    }
    const [updateUserMutation, { loading }] = useMutation<
        UpdateUserMutationData,
        UpdateUserVariables
    >(UPDATE_USER, {
        onCompleted: (res: UpdateUserMutationData) => {
            const updated = res.updateUser
            console.log('updated', updated)
        },
    })

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return
        await updateUserMutation({
            variables: {
                updateUserId: user.id,
                data: {
                    name,
                },
            },
        })
        updateUser({
            ...user,
            name: name
        })
    }

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <AppLayout>
            <div className="flex items-center justify-center py-6 md:py-10">

                <div className="w-full max-w-[480px] bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">

                    <div className="flex flex-col items-center text-center">
                        <div className="w-20 h-20 rounded-full bg-[#dbe1e8] text-gray-700 font-semibold text-xl flex items-center justify-center mb-4">
                            {user?.name?.charAt(0)}
                        </div>

                        <h2 className="text-xl font-bold text-gray-900 leading-tight">
                            {user?.name}
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">
                            {user?.email}
                        </p>
                    </div>

                    <div className="w-full h-px bg-gray-100 my-6" />

                    <form onSubmit={handleSave} className="space-y-5">

                        <div className="space-y-1.5">
                            <label htmlFor="name" className="text-sm font-semibold text-gray-700 block">
                                Nome completo
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    type="text"
                                    id="name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full h-12 pl-12 pr-4 bg-white border border-gray-200 rounded-xl text-gray-950 text-sm focus:outline-none focus:ring-2 focus:ring-[#1b623b]/20 focus:border-[#1b623b] transition-all font-medium"
                                    placeholder="Seu nome"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label htmlFor="email" className="text-sm font-semibold text-gray-700 block">
                                E-mail
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    type="email"
                                    id="email"
                                    value={user?.email}
                                    readOnly
                                    disabled
                                    className="w-full h-12 pl-12 pr-4 bg-gray-50 border border-gray-200 rounded-xl text-gray-400 text-sm font-medium cursor-not-allowed"
                                />
                            </div>
                            <span className="text-xs text-gray-400 block pt-0.5">
                                O e-mail não pode ser alterado
                            </span>
                        </div>

                        <div className="space-y-3 pt-4">

                            <Button
                                type="submit"
                                className="w-full h-12 bg-[#1b623b] hover:bg-[#154d2e] text-white rounded-xl font-semibold text-sm transition-all shadow-sm"
                                onClick={handleSave}
                            >
                                Salvar alterações
                            </Button>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="w-full h-12 border border-gray-200 hover:bg-red-50 text-red-500 hover:text-red-600 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors"
                            >
                                <LogOut className="w-4 h-4" />
                                <span>Sair da conta</span>
                            </button>

                        </div>

                    </form>

                </div>
            </div>
        </AppLayout>
    )
}