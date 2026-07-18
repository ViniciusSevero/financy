
interface SummaryCardProps {
    icon: React.ComponentType<{ className?: string }>
    value: string | number
    label: string
    iconColor: string
}


export function SummaryCard({ icon: Icon, value, label, iconColor }: SummaryCardProps) {
    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconColor}`}>
                <Icon className="w-6 h-6" />
            </div>
            <div>
                <span className="text-2xl md:text-3xl font-bold text-gray-900 block tracking-tight">
                    {value}
                </span>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-0.5 block">
                    {label}
                </span>
            </div>
        </div>
    )
}