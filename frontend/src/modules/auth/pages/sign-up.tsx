import React, { useState } from 'react'
import { Mail, Lock, User, Eye, EyeOff, LogIn } from 'lucide-react'
import { AuthLayout } from '../../../layouts/auth-layout'
import { Input } from '../../../components/ui/input'
import { Button } from '../../../components/ui/button'
import { toast } from "sonner"
import { useAuthStore } from '@/stores/auth'

export function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const signup = useAuthStore((state) => state.signup)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const signupMutate = await signup({
                name,
                email,
                password,
            })
            if (signupMutate) {
                toast.success("Cadastro realizado com sucesso!")
            }
        } catch (error: any) {
            toast.error("Erro ao realizar o cadastro")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <AuthLayout>
            <div className="text-center mb-8">
                <h2 className="text-xl font-bold text-gray-900 md:text-2xl">
                    Criar conta
                </h2>
                <p className="text-sm text-gray-500 mt-1.5">
                    Comece a controlar suas finanças ainda hoje
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Nome completo
                    </label>
                    <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome completo"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        disabled={isLoading}
                        icon={<User className="w-5 h-5" />}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                        E-mail
                    </label>
                    <Input
                        id="email"
                        type="email"
                        placeholder="mail@exemplo.com"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isLoading}
                        icon={<Mail className="w-5 h-5" />}
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-gray-700">
                        Senha
                    </label>
                    <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Digite sua senha"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        icon={<Lock className="w-5 h-5" />}
                        rightElement={
                            showPassword ? (
                                <EyeOff className="w-5 h-5 text-gray-400" onClick={() => setShowPassword(false)} />
                            ) : (
                                <Eye className="w-5 h-5 text-gray-400" onClick={() => setShowPassword(true)} />
                            )
                        }
                    />
                    <p className="text-xs text-gray-400 mt-1">
                        A senha deve ter no mínimo 8 caracteres
                    </p>
                </div>


                <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-[#1b623b] hover:bg-[#154d2e] text-white font-medium rounded-xl transition-all mt-2"
                >
                    {isLoading ? 'Criando conta...' : 'Cadastrar'}
                </Button>
            </form>

            <div className="relative flex py-5 items-center">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink mx-4 text-xs text-gray-400 uppercase tracking-wider">ou</span>
                <div className="flex-grow border-t border-gray-200"></div>
            </div>

            <div className="space-y-4 text-center">
                <p className="text-sm text-gray-500">Já tem uma conta?</p>
                <a href="/login">
                    <Button
                        variant="outline"
                        className="w-full h-12 flex items-center justify-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-xl font-medium transition-all"
                    >
                        <LogIn className="w-5 h-5 text-gray-500" />
                        Fazer login
                    </Button>
                </a>
            </div>
        </AuthLayout>
    )
}