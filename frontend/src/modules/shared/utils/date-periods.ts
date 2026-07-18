// src/shared/utils/date-periods.ts

interface PeriodOption {
    value: string; // Novo Formato: "MM-YYYY" (ex: "07-2026")
    label: string; // Texto amigável na tela (ex: "Julho de 2026")
}

export function generateMonthPeriods(count: number = 12): PeriodOption[] {
    const periods: PeriodOption[] = [];
    const currentDate = new Date();

    for (let i = 0; i < count; i++) {
        const d = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);

        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');

        // 🌟 Valor formatado como MM-YYYY
        const value = `${month}-${year}`;

        // Formata o texto visível (ex: "Julho de 2026")
        const label = d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
        const formattedLabel = label.charAt(0).toUpperCase() + label.slice(1);

        periods.push({ value, label: formattedLabel });
    }

    return periods;
}