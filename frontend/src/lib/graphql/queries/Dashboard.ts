import { gql } from "@apollo/client"

export const GET_DASHBOARD_STATS = gql`
    query GetDashboardStats {
        getDashboardStats {
            monthlyBalance
            monthlyIncome
            monthlyOutcome
            totalCategories
            totalTransactions
            mostUsedCategory {
                title
                count
                color 
                icon
            }
        }
    }
`